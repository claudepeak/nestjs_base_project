import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class SignInUserDto {
  @ApiProperty({ example: 'token' })
  @IsString()
  @IsOptional()
  fcmToken?: string;

  @ApiProperty({ example: 'alper-mf@hotmail.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '123456789' })
  @IsString()
  @IsNotEmpty()
  password: string;

}
