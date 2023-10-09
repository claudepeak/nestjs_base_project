import { Controller, Get } from '@nestjs/common';
import { RedisService } from './redis.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Public } from 'src/app/common/decorator/public.decorator';

@Controller()
@ApiBearerAuth()
export class RedisController {
  constructor(private readonly redisService: RedisService) {}

  @Get('redis/reset')
  @Public()
  async resetAllRedisData() {
    return await this.redisService.resetAllRedisData();
  }
}
