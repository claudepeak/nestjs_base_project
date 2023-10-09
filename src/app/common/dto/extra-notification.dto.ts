import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class ExtraDto {
  @ApiProperty({
    type: String,
    description: 'Circle, Booking Or Friend Request ID',
  })
  @IsString()
  sharedId: string;

  @ApiProperty({ type: String, description: 'body of notification' })
  @IsString()
  @IsOptional()
  extra?: string;
}
