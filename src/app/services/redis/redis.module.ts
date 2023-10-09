import { Inject, Logger, Module, OnModuleInit } from '@nestjs/common';
import { RedisService } from './redis.service';
import { RedisController } from './redis.controller';
import { CacheModule as BaseCacheModule } from '@nestjs/cache-manager';
import type { RedisClientOptions } from 'redis';
import { ConfigModule } from '@nestjs/config';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Module({
  controllers: [RedisController],
  providers: [RedisService],
  imports: [
    BaseCacheModule.registerAsync<RedisClientOptions>({
      isGlobal: true,
      useFactory: () => ({
        store: 'redis',
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
        ttl: 20 * 60 * 1000, //10 minutes (in milliseconds)
      }),
    }),
    ConfigModule,
  ],
  exports: [RedisService, BaseCacheModule],
})
export class RedisModule implements OnModuleInit {
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}
  public onModuleInit(): any {
    const logger = new Logger('Cache');
    logger.log(`Redis connected`);
  }
}
