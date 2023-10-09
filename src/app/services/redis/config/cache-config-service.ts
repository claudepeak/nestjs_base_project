import { Injectable } from '@nestjs/common';
import { CacheModuleOptions, CacheOptionsFactory } from "@nestjs/common/cache";

@Injectable()
class CacheConfigService implements CacheOptionsFactory {
  createCacheOptions(): CacheModuleOptions {
    return {
      ttl: 5,
    };
  }
}
