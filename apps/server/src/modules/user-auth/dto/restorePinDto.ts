import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  Length,
  Matches,
} from 'class-validator';

export class RestorePinDto {
  @ApiPropertyOptional({
    description: '6-digit OTP sent via /user-auth/pin/recovery/request-otp',
    example: '123456',
  })
  @IsOptional()
  @IsString()
  @Length(6, 6, { message: 'OTP code must be exactly 6 digits' })
  @Matches(/^\d{6}$/, { message: 'OTP code must contain only numbers' })
  otpCode?: string;

  @ApiPropertyOptional({
    description: '11-digit BVN for KYC verification',
    example: '22233344455',
  })
  @IsOptional()
  @IsString()
  @Length(11, 11, { message: 'BVN must be exactly 11 digits' })
  @Matches(/^\d{11}$/, { message: 'BVN must contain only numbers' })
  bvn?: string;

  @ApiPropertyOptional({
    description: 'Date of birth on file (YYYY-MM-DD) for additional KYC check',
    example: '1995-05-15',
  })
  @IsOptional()
  @IsString()
  dateOfBirth?: string;

  @ApiPropertyOptional({
    description:
      'Optional new 4-digit numeric transaction PIN to set while restoring PIN authorization',
    example: '5678',
  })
  @IsOptional()
  @IsString()
  @Length(4, 4, { message: 'New PIN must be exactly 4 digits' })
  @Matches(/^\d{4}$/, { message: 'New PIN must contain only numbers' })
  newPin?: string;
}
