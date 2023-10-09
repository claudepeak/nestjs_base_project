import {Inject, Injectable} from '@nestjs/common';
import {Cache} from 'cache-manager';
import {CACHE_MANAGER} from '@nestjs/cache-manager';
import * as Redis from 'ioredis';

@Injectable()
export class RedisService {
    private readonly client: Redis.Redis;

    constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {
        // this.client = new Redis();
    }

    public async get(key: string): Promise<any> {
        return await this.cacheManager.get(key);
    }

    public async set(key: string, value: any): Promise<any> {
        try {
            return await this.cacheManager.set(key, value);
        } catch (e) {
            console.log(e);
        }
    }

    public async del(key: string): Promise<any> {
        return await this.cacheManager.del(key);
    }

    public async resetAllRedisData() {
        await this.cacheManager.reset();

        return {
            message: 'All redis data has been reset',
        };
    }
}
