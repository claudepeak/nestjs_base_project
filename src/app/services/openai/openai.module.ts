import { Module } from '@nestjs/common';
import { OpenaiService } from './openai.service';
import { OpenaiController } from './openai.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { RedisService } from '../redis/redis.service';

@Module({
  controllers: [OpenaiController],
  providers: [OpenaiService, PrismaService, RedisService, Object],
})
export class OpenaiModule {}
