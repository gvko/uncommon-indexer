import { Controller, Get, Post } from '@nestjs/common';
import { CacheService } from './cache.service';

@Controller('cache')
export class CacheController {
  constructor(private cacheService: CacheService) {
  }

  @Post()
  async loadEntriesIntoCache(): Promise<string> {
    await this.cacheService.loadEntriesIntoCache();

    return 'OK';
  }

  @Get()
  async getSets(): Promise<any> {
    return this.cacheService.getSortedSets();
  }
}
