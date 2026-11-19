import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class VerifyBiometricDto {
  @ApiProperty({
    description: 'Unique device identifier enrolled for biometric login',
    example: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d',
  })
  @IsString()
  @IsNotEmpty()
  deviceId: string;

  @ApiProperty({
    description: 'Challenge ID returned by /user-auth/biometric/challenge',
    example: '8f14e45f-ceea-467f-a813-9f92e4b3c123',
  })
  @IsString()
  @IsNotEmpty()
  challengeId: string;

  @ApiProperty({
    description:
      'Base64 or base64url encoded cryptographic signature of the challenge string produced by the device private key',
    example: 'MEUCIQDf...==',
  })
  @IsString()
  @IsNotEmpty()
  signature: string;

  @ApiPropertyOptional({
    description:
      'Optional user identifier (email or phone) to double-check account binding',
    example: 'user@example.com',
  })
  @IsString()
  @IsOptional()
  identifier?: string;

  @ApiPropertyOptional({
    description: 'Optional user ID to double-check account binding',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsString()
  @IsOptional()
  userId?: string;
}
