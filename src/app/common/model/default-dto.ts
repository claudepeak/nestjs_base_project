// completed-response.dto.ts
import {ApiProperty} from '@nestjs/swagger';

export class CompletedResponseDTO {
    @ApiProperty({type: Number, example: 200, description: 'Status code'})
    status: 200;


    @ApiProperty({type: Object, example: {completed: true}, description: 'Message'})
    message: { completed: true };
}

export class NotFoundResponseDTO {
  @ApiProperty({ type: Number, example: 404, description: 'Status code' })
  status: number;

  @ApiProperty({ type: Object, example: { error: 'Resource not found' }, description: 'Message' })
  message: { error: "Not Found" };
}