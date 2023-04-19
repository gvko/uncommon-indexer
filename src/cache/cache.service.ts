import { Injectable, Logger } from '@nestjs/common';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import Redis from 'ioredis';

@Injectable()
export class CacheService {
  private readonly logger: Logger;

  constructor(
    @InjectRedis() private readonly redis: Redis,
  ) {
    this.logger = new Logger(CacheService.name);
  }

  async loadEntriesIntoCache() {
    await this.redis.set('key', 'value', 'EX', 1000);
  }
}
