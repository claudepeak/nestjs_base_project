import { Controller } from '@nestjs/common';
import { OpenaiService } from './openai.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Openai')
@Controller('openai')
@ApiBearerAuth()
export class OpenaiController {
  constructor(private readonly openaiService: OpenaiService) {}
}
