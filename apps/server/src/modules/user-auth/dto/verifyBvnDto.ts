import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class VerifyBvnDto {
  @ApiProperty({
    description: '11-digit Bank Verification Number (BVN)',
    example: '22222222222',
  })
  @IsString()
  @Length(11, 11)
  @IsNotEmpty()
  bvn: string;
}
