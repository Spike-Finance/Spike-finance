import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';
import { DeviceType } from '@spike/database';

export class VerifyOtpDto {
  @ApiProperty({
    description: 'Target email or phone number where OTP was sent',
    example: 'example@email.com',
  })
  @IsString()
  @IsNotEmpty()
  identifier: string;

  @ApiProperty({
    description: '6-digit OTP code',
    example: '123456',
  })
  @IsString()
  @Length(6, 6)
  code: string;

  @ApiPropertyOptional({
    description: 'Unique device identifier (UUID or vendor identifier)',
    example: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d',
  })
  @IsString()
  @IsOptional()
  deviceId?: string;

  @ApiPropertyOptional({
    description: 'Human-readable name of the device',
    example: 'iPhone 15 Pro',
  })
  @IsString()
  @IsOptional()
  deviceName?: string;

  @ApiPropertyOptional({
    description: 'Device platform type',
    enum: DeviceType,
    example: 'IOS',
  })
  @IsEnum(DeviceType)
  @IsOptional()
  deviceType?: DeviceType;
}
