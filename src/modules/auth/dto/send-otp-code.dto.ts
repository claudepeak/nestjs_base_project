import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class SendOtpCodeDto {
  @ApiProperty({ example: 'alper-mf@hotmail.com' })
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
