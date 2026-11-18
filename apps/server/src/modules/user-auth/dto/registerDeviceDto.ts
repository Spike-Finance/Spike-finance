import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { DeviceType } from '@spike/database';

export class RegisterDeviceDto {
  @ApiProperty({
    description: 'Unique device identifier (UUID or vendor identifier)',
    example: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d',
  })
  @IsString()
  @IsNotEmpty()
  deviceId: string;

  @ApiPropertyOptional({
    description: 'Human-readable name of the device',
    example: 'iPhone 15 Pro',
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: 'Type of operating system / platform',
    enum: DeviceType,
    example: 'IOS',
  })
  @IsEnum(DeviceType)
  deviceType: DeviceType;

  @ApiPropertyOptional({
    description: 'IP address of the client device (auto-detected if omitted)',
    example: '197.210.54.12',
  })
  @IsString()
  @IsOptional()
  ip?: string;

  @ApiPropertyOptional({
    description: 'Geographic location / region of the device',
    example: 'Lagos, Nigeria',
  })
  @IsString()
  @IsOptional()
  location?: string;
}
