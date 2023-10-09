import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, MaxLength } from 'class-validator';
import { HttpStatus } from '@nestjs/common';

enum VerificationStatusEnum {
  SUCCESS = 'SUCCESS',
  FAILURE = 'FAILURE',
}

export class ResetPasswordDto {
  @ApiProperty({ example: 'alper-mf@hotmail.com' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ example: '123456' })
  @IsOptional()
  @MaxLength(6)
  otpCode?: string;
}

export class ResetPasswordResDto {
  @ApiProperty({ type: String, example: 'OTP is sent' })
  message: string;

  @ApiProperty({ type: Number, example: 201, enum: HttpStatus })
  statusCode: number;
}

export class VerfiyOtpResponse {
  @ApiProperty({ type: String, example: 'OTP is valid' })
  message: string;

  @ApiProperty({ type: String, enum: VerificationStatusEnum })
  success: VerificationStatusEnum.SUCCESS;

  @ApiProperty({ type: String })
  transactionId: string;
}
