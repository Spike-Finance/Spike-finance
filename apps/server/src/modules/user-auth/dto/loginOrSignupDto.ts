import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';

export class LoginOrSignUpDto {
  @IsString()
  @IsEmail()
  @IsOptional()
  @ApiPropertyOptional({
    example: 'example@email.com',
  })
  email?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    example: '+2348012345678',
  })
  phone?: string;
}
