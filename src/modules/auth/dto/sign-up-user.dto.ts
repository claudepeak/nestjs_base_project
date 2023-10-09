import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { UserResponseModel } from '../model/user-response.model';

export class TokenDto {
  @ApiProperty({ type: String })
  access_token: string;
}

export class SignUpUserDto {
  @ApiProperty({ example: 'alper-mf@hotmail.com', required: true })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '123456', required: true })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({ example: 'alper', required: true })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'duzgun', required: true })
  @IsString()
  @IsNotEmpty()
  username: string;


  @ApiProperty({ example: '+905367051579', required: false })
  @IsString()
  @IsOptional()
  phone: string;

  @ApiProperty({ example: false, required: false })
  @IsOptional()
  is_admin: boolean;
}

export class SignupResponseDto {
  @ApiProperty({ type: String })
  access_token: string;

  @ApiProperty({ type: UserResponseModel })
  user: UserResponseModel;
}
