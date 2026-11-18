import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserAuthService } from './user-auth.service';
import { LoginOrSignUpDto } from './dto/loginOrSignupDto';
import { ResendOtpDto } from './dto/resendOtpDto';
import { VerifyOtpDto } from './dto/verifyOtpDto';
import { RefreshTokenDto } from './dto/refreshTokenDto';
import { UpdateUserDetailsDto } from './dto/updateUserDetailsDto';
import { VerifyBvnDto } from './dto/verifyBvnDto';
import { CreatePinDto } from './dto/createPinDto';
import { VerifyPinDto } from './dto/verifyPinDto';
import { ChangePinDto } from './dto/changePinDto';
import { RegisterPushTokenDto } from './dto/registerPushTokenDto';
import { RegisterDeviceDto } from './dto/registerDeviceDto';
import { AuthGuard } from '../../common/guards/auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Auth & KYC')
@Controller('user-auth')
export class UserAuthController {
  constructor(private readonly userAuthService: UserAuthService) { }

  @Post('login-or-signup')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Login or register user and send 6-digit verification OTP',
    description:
      'Checks if user exists by email or phone. If not, creates account with default MAIN pocket and dispatches a 5-minute OTP via Resend (email) or Sent (SMS).',
  })
  @ApiQuery({
    name: 'type',
    required: false,
    enum: ['email', 'phone'],
    description: 'Preferred verification delivery channel',
  })
  @ApiResponse({ status: 200, description: 'OTP sent successfully' })
  loginOrSignup(
    @Body() payload: LoginOrSignUpDto,
    @Query('type') type?: 'email' | 'phone',
  ) {
    return this.userAuthService.loginOrSignup({ payload, type });
  }

  @Post('resend-otp')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Resend OTP verification code',
    description:
      'Invalidates previous unused OTPs and sends a fresh 6-digit OTP code to the provided email or phone number.',
  })
  @ApiQuery({
    name: 'type',
    required: false,
    enum: ['email', 'phone'],
    description: 'Preferred verification delivery channel',
  })
  @ApiResponse({ status: 200, description: 'OTP resent successfully' })
  resendOtp(
    @Body() payload: ResendOtpDto,
    @Query('type') type?: 'email' | 'phone',
  ) {
    return this.userAuthService.resendOtp({ payload, type });
  }

  @Post('verify-otp')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Verify OTP code and authenticate',
    description:
      'Validates 6-digit OTP code, marks identifier as verified, and returns user details with access and refresh tokens.',
  })
  @ApiResponse({
    status: 200,
    description: 'Authentication successful. Returns user and JWT tokens.',
  })
  verifyOtp(@Body() dto: VerifyOtpDto) {
    return this.userAuthService.verifyOtp(dto);
  }

  @Get('me')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get current authenticated user profile',
  })
  @ApiResponse({
    status: 200,
    description: 'Current user profile with pockets, virtual accounts, and tag',
  })
  getMe(@CurrentUser('sub') userId: string) {
    return this.userAuthService.getMe(userId);
  }

  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Refresh access and refresh tokens',
  })
  @ApiResponse({
    status: 200,
    description: 'New access and refresh tokens generated',
  })
  refreshToken(@Body() dto: RefreshTokenDto) {
    return this.userAuthService.refreshToken(dto);
  }

  @Patch('update-details')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary:
      'Update personal profile details (names, date of birth, push token)',
  })
  @ApiResponse({ status: 200, description: 'Profile updated successfully' })
  updateUserDetails(
    @CurrentUser('sub') userId: string,
    @Body() dto: UpdateUserDetailsDto,
  ) {
    return this.userAuthService.updateUserDetails(userId, dto);
  }

  @Post('verify-bvn')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary:
      'Submit and verify BVN, then generate Moniepoint NUBAN virtual account',
    description:
      'Stores BVN, marks user as BVN-verified, and generates a dedicated Moniepoint NUBAN virtual account formatted as SPIKE-${FULL_NAME}.',
  })
  @ApiResponse({
    status: 200,
    description: 'BVN verified and Moniepoint NUBAN virtual account generated',
  })
  verifyBvnAndCreateNuban(
    @CurrentUser('sub') userId: string,
    @Body() dto: VerifyBvnDto,
  ) {
    return this.userAuthService.verifyBvnAndCreateNuban(userId, dto);
  }

  @Post('create-pin')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Create 4-digit numeric transaction PIN',
    description:
      'Creates and securely hashes a 4-digit transaction PIN for the authenticated user.',
  })
  @ApiResponse({ status: 200, description: 'PIN created successfully' })
  createPin(@CurrentUser('sub') userId: string, @Body() dto: CreatePinDto) {
    return this.userAuthService.createPin(userId, dto);
  }

  @Post('verify-pin')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Verify 4-digit transaction PIN',
    description:
      'Validates the provided 4-digit transaction PIN against the stored hash for the authenticated user.',
  })
  @ApiResponse({ status: 200, description: 'PIN verified successfully' })
  verifyPin(@CurrentUser('sub') userId: string, @Body() dto: VerifyPinDto) {
    return this.userAuthService.verifyPin(userId, dto);
  }

  @Post('change-pin')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Change 4-digit transaction PIN',
    description:
      'Verifies the old 4-digit PIN and updates it with a new hashed 4-digit PIN for the authenticated user.',
  })
  @ApiResponse({ status: 200, description: 'PIN changed successfully' })
  changePin(@CurrentUser('sub') userId: string, @Body() dto: ChangePinDto) {
    return this.userAuthService.changePin(userId, dto);
  }

  @Post('push-token')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Register user push notification token',
    description:
      'Registers or updates FCM / APNs push token for the authenticated user.',
  })
  @ApiResponse({
    status: 200,
    description: 'Push token registered successfully',
  })
  registerPushToken(
    @CurrentUser('sub') userId: string,
    @Body() dto: RegisterPushTokenDto,
  ) {
    return this.userAuthService.registerPushToken(userId, dto);
  }

  @Post('device')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Register user current device',
    description:
      'Registers or updates the authenticated user device with deviceType, IP address, and location.',
  })
  @ApiResponse({ status: 200, description: 'Device registered successfully' })
  registerDevice(
    @CurrentUser('sub') userId: string,
    @Body() dto: RegisterDeviceDto,
    @Req() req: Request,
  ) {
    const rawIp =
      (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
      req.ip ||
      req.socket?.remoteAddress;
    return this.userAuthService.registerDevice(userId, dto, rawIp);
  }
}
