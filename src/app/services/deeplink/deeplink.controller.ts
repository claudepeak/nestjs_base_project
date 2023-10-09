import { Controller, Get } from '@nestjs/common';
import { DeeplinkService } from './deeplink.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller('deeplink')
@ApiTags('deeplink')
@ApiBearerAuth()
export class DeeplinkController {
  constructor(private readonly deeplinkService: DeeplinkService) {}

  @Get('create-deeplink')
  async createDeeplink(): Promise<string> {
    return this.deeplinkService.createDeeplink();
  }
}
