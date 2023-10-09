import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateProfileDto {
  @ApiProperty({ example: 'alper-mf@hotmail.com', required: false })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({ example: '123456', required: false })
  @IsString()
  @IsOptional()
  @MinLength(6)
  password?: string;

  @ApiProperty({ example: 'alper', required: false })
  @IsString()
  @IsOptional()
  userName?: string;

  @ApiProperty({ example: 'alper', required: false })
  @IsString()
  @IsOptional()
  name?: string;
}
