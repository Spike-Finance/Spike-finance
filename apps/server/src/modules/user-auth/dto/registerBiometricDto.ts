import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { DeviceType } from '@spike/database';

export const SUPPORTED_BIOMETRIC_ALGORITHMS = [
  'ES256',
  'RS256',
  'EdDSA',
] as const;

export type BiometricKeyAlgorithm =
  (typeof SUPPORTED_BIOMETRIC_ALGORITHMS)[number];

export class RegisterBiometricDto {
  @ApiProperty({
    description: 'Unique device identifier (UUID or vendor identifier)',
    example: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d',
  })
  @IsString()
  @IsNotEmpty()
  deviceId: string;

  @ApiProperty({
    description:
      'Asymmetric SPKI public key generated in device Secure Enclave / Android Keystore (PEM format or base64-encoded DER SPKI)',
    example:
      '-----BEGIN PUBLIC KEY-----\nMFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAE...\n-----END PUBLIC KEY-----',
  })
  @IsString()
  @IsNotEmpty()
  publicKey: string;

  @ApiPropertyOptional({
    description: 'Key signature algorithm (auto-detected from key if omitted)',
    enum: SUPPORTED_BIOMETRIC_ALGORITHMS,
    example: 'ES256',
  })
  @IsString()
  @IsIn(SUPPORTED_BIOMETRIC_ALGORITHMS)
  @IsOptional()
  keyAlgorithm?: BiometricKeyAlgorithm;

  @ApiPropertyOptional({
    description: 'Human-readable name of the device',
    example: 'iPhone 15 Pro',
  })
  @IsString()
  @IsOptional()
  deviceName?: string;

  @ApiPropertyOptional({
    description: 'Type of operating system / platform',
    enum: DeviceType,
    example: 'IOS',
  })
  @IsEnum(DeviceType)
  @IsOptional()
  deviceType?: DeviceType;

  @ApiPropertyOptional({
    description: 'Geographic location / region of the device',
    example: 'Lagos, Nigeria',
  })
  @IsString()
  @IsOptional()
  location?: string;
}
