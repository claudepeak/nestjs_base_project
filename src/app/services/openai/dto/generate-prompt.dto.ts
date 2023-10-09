import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class GeneratePromptDto {
  @ApiProperty({ example: 'Job Description', required: true })
  @IsString()
  @IsNotEmpty()
  jobDescription: string;

  @ApiProperty({ example: '1', required: true })
  @IsString()
  @IsNotEmpty()
  taskId: string;
}
