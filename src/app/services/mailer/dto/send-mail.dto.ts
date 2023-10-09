import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';

export class SendMailDto {
  @ApiProperty({ example: 'alper-mf@hotmail.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Testing Nest MailerModule' })
  @IsString()
  subject: string;

  @ApiProperty({ example: 'Message' })
  @IsString()
  @IsOptional()
  message: string;

  @ApiProperty({ example: 'Message' })
  @IsOptional()
  template?: string;

  @ApiProperty({ example: { email: 'alper-mf@hotmail.com' } })
  @IsOptional()
  context?: any;
}
