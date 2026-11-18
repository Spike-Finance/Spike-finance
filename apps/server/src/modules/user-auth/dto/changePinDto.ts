import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';

export class ChangePinDto {
  @ApiProperty({
    description: 'Current 4-digit numeric transaction PIN',
    example: '1234',
  })
  @IsString()
  @IsNotEmpty()
  @Length(4, 4, { message: 'Old PIN must be exactly 4 digits' })
  @Matches(/^\d{4}$/, { message: 'Old PIN must contain only numbers' })
  oldPin: string;

  @ApiProperty({
    description: 'New 4-digit numeric transaction PIN',
    example: '5678',
  })
  @IsString()
  @IsNotEmpty()
  @Length(4, 4, { message: 'New PIN must be exactly 4 digits' })
  @Matches(/^\d{4}$/, { message: 'New PIN must contain only numbers' })
  newPin: string;
}
