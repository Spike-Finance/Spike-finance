import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Length,
  Matches,
  Max,
  Min,
} from 'class-validator';

export class CreateSavingsLockDto {
  @ApiProperty({
    description: 'Name for the locked savings pocket',
    example: 'Rent 2027',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Amount to lock from MAIN wallet in NGN',
    example: 50000,
  })
  @IsNumber()
  @IsPositive()
  amount: number;

  @ApiProperty({
    description: 'Number of days to lock the savings',
    example: 90,
  })
  @IsInt()
  @Min(7)
  @Max(1095)
  lockDays: number;

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
