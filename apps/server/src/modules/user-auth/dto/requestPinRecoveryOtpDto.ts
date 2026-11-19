import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsOptional } from 'class-validator';

export class RequestPinRecoveryOtpDto {
  @ApiPropertyOptional({
    description:
      'Preferred OTP delivery channel (defaults to verified email or phone on file)',
    enum: ['email', 'phone'],
    example: 'email',
  })
  @IsOptional()
  @IsIn(['email', 'phone'])
  channel?: 'email' | 'phone';
}
