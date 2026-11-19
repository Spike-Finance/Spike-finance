import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Length,
  Matches,
} from 'class-validator';

export const BILL_CATEGORIES = [
  'AIRTIME',
  'DATA',
  'ELECTRICITY',
  'CABLE',
  'INTERNET',
  'WATER',
] as const;

export type BillCategory = (typeof BILL_CATEGORIES)[number];

export class PayBillDto {
  @ApiProperty({
    description: 'Bill category',
    enum: BILL_CATEGORIES,
    example: 'ELECTRICITY',
  })
  @IsIn(BILL_CATEGORIES)
  category: BillCategory;

  @ApiProperty({
    description: 'Bill provider / biller code (e.g., IKEDC, MTN, DSTV)',
    example: 'IKEDC',
  })
  @IsString()
  @IsNotEmpty()
  provider: string;

  @ApiProperty({
    description: 'Customer meter number, phone number, or smartcard number',
    example: '04123456789',
  })
  @IsString()
  @IsNotEmpty()
  customerReference: string;

  @ApiProperty({
    description: 'Bill payment amount in NGN',
    example: 10000,
  })
  @IsNumber()
  @IsPositive()
  amount: number;

  @ApiPropertyOptional({
    description: 'Optional description or narration',
    example: 'Prepaid electricity token',
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
