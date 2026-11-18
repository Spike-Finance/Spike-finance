import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserAuthService } from './user-auth.service';
import { LoginOrSignUpDto } from './dto/loginOrSignupDto';
import { VerifyOtpDto } from './dto/verifyOtpDto';
import { RefreshTokenDto } from './dto/refreshTokenDto';
import { UpdateUserDetailsDto } from './dto/updateUserDetailsDto';
import { VerifyBvnDto } from './dto/verifyBvnDto';
import { AuthGuard } from '../../common/guards/auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('User Authentication & Onboarding')
@Controller(['auth', 'user-auth'])
export class UserAuthController {
  constructor(private readonly userAuthService: UserAuthService) {}

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
}
