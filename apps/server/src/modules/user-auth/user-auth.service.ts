import {
    BadRequestException,
    Injectable,
    Logger,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { OtpMethod } from '@spike/database';
import { PrismaService } from '../../common/services/prisma/prisma.service';
import { EmailService } from '../../common/services/email/email.service';
import {
    DEFAULT_SERVICE_TEMPLATE,
    SentService,
} from '../../common/services/sent/sent.service';
import { LoginOrSignUpDto } from './dto/loginOrSignupDto';
import { VerifyOtpDto } from './dto/verifyOtpDto';
import { RefreshTokenDto } from './dto/refreshTokenDto';
import { UpdateUserDetailsDto } from './dto/updateUserDetailsDto';
import { VerifyBvnDto } from './dto/verifyBvnDto';

@Injectable()
export class UserAuthService {
    private readonly logger = new Logger(UserAuthService.name);

    constructor(
        private readonly databaseService: PrismaService,
        private readonly emailService: EmailService,
        private readonly sentService: SentService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
    ) { }

    /**
     * 1. Check if user exists by email/phone.
     * If not, create an account with default MAIN pocket.
     * Generate 6-digit OTP, store with 5-minute expiry, and dispatch via Resend (email) or Sent (SMS).
     */
    async loginOrSignup({
        payload,
        type,
    }: {
        payload: LoginOrSignUpDto;
        type?: 'email' | 'phone';
    }) {
        const isEmail =
            type === 'email' || (Boolean(payload.email) && !payload.phone);
        const isPhone = type === 'phone' || Boolean(payload.phone);

        if (isEmail && !payload.email) {
            throw new BadRequestException('Email address is required');
        }
        if (isPhone && !payload.phone) {
            throw new BadRequestException('Phone number is required');
        }
        if (!isEmail && !isPhone) {
            throw new BadRequestException(
                'Please provide either an email address or phone number',
            );
        }

        const method: OtpMethod = isEmail ? OtpMethod.EMAIL : OtpMethod.PHONE;
        const target = isEmail
            ? payload.email!.trim().toLowerCase()
            : payload.phone!.trim();

        this.logger.log(`Processing login/signup for ${method}: ${target}`);

        // Check if user exists
        let user = await this.databaseService.user.findFirst({
            where: isEmail ? { email: target } : { phone: target },
        });

        if (!user) {
            this.logger.log(`User not found for ${target}. Creating new account...`);
            user = await this.databaseService.user.create({
                data: {
                    email: isEmail ? target : undefined,
                    phone: !isEmail ? target : undefined,
                },
            });

            // Create primary wallet (MAIN pocket) for new user
            await this.databaseService.pocket.create({
                data: {
                    userId: user.id,
                    name: 'Main Balance',
                    type: 'MAIN',
                    currency: 'NGN',
                },
            });
            this.logger.log(`Created new user (${user.id}) with default MAIN pocket`);
        }

        // Generate random 6-digit OTP
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes expiry

        // Invalidate any existing unused OTPs for this target
        await this.databaseService.otp.updateMany({
            where: { target, isUsed: false },
            data: { isUsed: true },
        });

        // Save OTP to database
        await this.databaseService.otp.create({
            data: {
                userId: user.id,
                code,
                method,
                target,
                expiresAt,
            },
        });

        // Dispatch OTP
        if (isEmail) {
            await this.emailService.sendOtpEmail(target, code);
            this.logger.log(`OTP dispatched via Resend to ${target}`);
        } else {
            await this.sentService.sendMessage({
                channel: ['sms'],
                to: [target],
                template: {
                    id: DEFAULT_SERVICE_TEMPLATE,
                    otp: code,
                },
            });
            this.logger.log(`OTP dispatched via Sent SMS to ${target}`);
        }

        return {
            message: `Verification code sent to your ${isEmail ? 'email address' : 'phone number'}`,
            target,
            method,
            expiresAt,
        };
    }

    /**
     * 2. Verify OTP code, mark it used, mark user verified, and issue tokens.
     */
    async verifyOtp(dto: VerifyOtpDto) {
        const target = dto.identifier.trim();
        const code = dto.code.trim();

        const otpRecord = await this.databaseService.otp.findFirst({
            where: {
                target,
                code,
                isUsed: false,
            },
            orderBy: { createdAt: 'desc' },
            include: { user: true },
        });

        if (!otpRecord) {
            throw new BadRequestException('Invalid verification code');
        }

        if (otpRecord.expiresAt < new Date()) {
            throw new BadRequestException(
                'Verification code has expired. Please request a new one.',
            );
        }

        // Mark OTP as used
        await this.databaseService.otp.update({
            where: { id: otpRecord.id },
            data: { isUsed: true },
        });

        // Update user status
        const isEmail = otpRecord.method === 'EMAIL';
        const updatedUser = await this.databaseService.user.update({
            where: { id: otpRecord.userId },
            data: {
                isEmailVerified: isEmail ? true : undefined,
                isPhoneVerified: !isEmail ? true : undefined,
                isLoggedIn: true,
                lastLoginAt: new Date(),
            },
            include: {
                pockets: true,
                virtualAccounts: true,
                tag: true,
            },
        });

        const tokens = await this.generateTokens(
            updatedUser.id,
            updatedUser.email,
            updatedUser.phone,
        );

        return {
            message: 'Verification successful',
            user: this.sanitizeUser(updatedUser),
            ...tokens,
        };
    }

    /**
     * 3. Get profile details for authenticated user.
     */
    async getMe(userId: string) {
        const user = await this.databaseService.user.findUnique({
            where: { id: userId },
            include: {
                pockets: true,
                tag: true,
            },
        });

        if (!user) {
            throw new NotFoundException('User profile not found');
        }

        return this.sanitizeUser(user);
    }

    /**
     * 4. Refresh access token using a valid refresh token.
     */
    async refreshToken(dto: RefreshTokenDto) {
        try {
            const payload = await this.jwtService.verifyAsync<{
                sub: string;
                tokenType?: string;
            }>(dto.refreshToken, {
                secret: this.configService.getOrThrow<string>('JWT_SECRET'),
            });

            if (payload.tokenType !== 'refresh') {
                throw new UnauthorizedException('Invalid token type');
            }

            const user = await this.databaseService.user.findUnique({
                where: { id: payload.sub },
            });

            if (!user || user.isDeleted) {
                throw new UnauthorizedException('User account no longer exists');
            }

            const tokens = await this.generateTokens(user.id, user.email, user.phone);
            return {
                message: 'Tokens refreshed successfully',
                ...tokens,
            };
        } catch {
            throw new UnauthorizedException('Invalid or expired refresh token');
        }
    }

    /**
     * 5. Update user personal details (names, DOB, push token).
     */
    async updateUserDetails(userId: string, dto: UpdateUserDetailsDto) {
        const user = await this.databaseService.user.update({
            where: { id: userId },
            data: {
                firstName: dto.firstName,
                lastName: dto.lastName,
                dateOfBirth: dto.dateOfBirth,
                pushToken: dto.pushToken,
            },
            include: {
                pockets: true,
                tag: true,
            },
        });

        return {
            message: 'Profile updated successfully',
            user: this.sanitizeUser(user),
        };
    }

    /**
     * 6. Verify BVN, update user record, and provision dummy Moniepoint NUBAN account with SPIKE prefix.
     */
    async verifyBvnAndCreateNuban(userId: string, dto: VerifyBvnDto) {
        const bvn = dto.bvn.trim();
        if (!/^\d{11}$/.test(bvn)) {
            throw new BadRequestException('BVN must be an 11-digit number');
        }

        const user = await this.databaseService.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        // Update user BVN status
        const updatedUser = await this.databaseService.user.update({
            where: { id: userId },
            data: {
                bvn,
                kycTier: user.kycTier === 'TIER_0' ? 'TIER_1' : user.kycTier,
            },
            include: {
                pockets: true,
                tag: true,
            },
        });

        // Check if user already has an active NUBAN account
        let virtualAccount = await this.databaseService.virtualAccount.findFirst({
            where: { userId: user.id },
        });

        if (!virtualAccount) {
            // Generate dummy Moniepoint NUBAN (10 digits starting with 65)
            const randomSuffix = Math.floor(
                10000000 + Math.random() * 90000000,
            ).toString();
            const accountNumber = `65${randomSuffix}`;

            // SPIKE-${full name}
            const rawFullName =
                `${updatedUser.firstName || ''} ${updatedUser.lastName || ''}`.trim();
            const identifier =
                rawFullName || updatedUser.email || updatedUser.phone || 'USER';
            const accountName = `SPIKE-${identifier.toUpperCase()}`;

            virtualAccount = await this.databaseService.virtualAccount.create({
                data: {
                    userId: user.id,
                    bankName: 'Moniepoint Microfinance Bank',
                    bankCode: '50515',
                    accountNumber,
                    accountName,
                    currency: 'NGN',
                    status: 'ACTIVE',
                },
            });

            this.logger.log(
                `Generated Moniepoint dummy NUBAN (${accountNumber}) for user ${user.id} with name "${accountName}"`,
            );
        }

        return {
            message: 'BVN verified successfully and NUBAN account created',
            user: this.sanitizeUser(updatedUser),
            virtualAccount,
        };
    }

    /**
     * Helper to sign access token (1h) and refresh token (7d).
     */
    private async generateTokens(
        userId: string,
        email?: string | null,
        phone?: string | null,
    ): Promise<{ accessToken: string; refreshToken: string; expiresIn: number }> {
        const payload = { sub: userId, email, phone };
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(payload, { expiresIn: '1h' }),
            this.jwtService.signAsync(
                { sub: userId, tokenType: 'refresh' },
                { expiresIn: '7d' },
            ),
        ]);

        return {
            accessToken,
            refreshToken,
            expiresIn: 3600,
        };
    }

    /**
     * Helper to remove password and transaction PIN from responses.
     */
    private sanitizeUser<T extends Record<string, unknown>>(
        user: T,
    ): Omit<T, 'password' | 'transactionPin'> {
        const sanitized = { ...user };
        delete (sanitized as { password?: unknown }).password;
        delete (sanitized as { transactionPin?: unknown }).transactionPin;
        return sanitized;
    }
}
