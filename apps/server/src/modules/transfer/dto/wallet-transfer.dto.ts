import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Length,
  Matches,
} from 'class-validator';

export class WalletTransferDto {
  @ApiProperty({
    description: 'Recipient user ID, Spike tag, email, or phone number',
    example: 'john.doe@example.com',
  })
  @IsString()
  @IsNotEmpty()
  recipientIdentifier: string;

  @ApiProperty({
    description: 'Amount to transfer in NGN',
    example: 5000,
  })
  @IsNumber()
  @IsPositive()
  amount: number;

  @ApiPropertyOptional({
    description: 'Optional transfer narration / description',
    example: 'Lunch split',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description:
      '4-digit transaction PIN (optional in body if supplied in x-transaction-pin header)',
    example: '1234',
  })
  @IsOptional()
  @IsString()
  @Length(4, 4, { message: 'PIN must be exactly 4 digits' })
  @Matches(/^\d{4}$/, { message: 'PIN must contain only numbers' })
  transactionPin?: string;
}
