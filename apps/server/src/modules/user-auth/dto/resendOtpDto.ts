import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';

export class ResendOtpDto {
  @ApiPropertyOptional({
    description: 'Email address where OTP was requested',
    example: 'example@email.com',
  })
  @IsString()
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({
    description: 'Phone number where OTP was requested',
    example: '+2348012345678',
  })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional({
    description: 'Unified identifier (email or phone number)',
    example: 'example@email.com',
  })
  @IsString()
  @IsOptional()
  identifier?: string;
}
