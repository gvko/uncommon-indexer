import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import Redis from 'ioredis';
import * as fs from 'fs';
import * as util from 'util';
import * as path from 'path';

const readFileAsync = util.promisify(fs.readFile);

enum RedisRootKey {
  entry = 'entry',
  collection = 'collection',
}

interface JsonDataObj {
  id: string;
  collection_id: string;
  entry_id: string;
  follower_id: string;
}

@Injectable()
export class CacheService {
  private readonly logger: Logger;

  constructor(
    @InjectRedis() private readonly redis: Redis,
  ) {
    this.logger = new Logger(CacheService.name);
  }

  async readJsonFile() {
    try {
      const filePath = path.join(__dirname, '..', '..', 'assets', 'entries-and-collections.json');
      const data = await readFileAsync(filePath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      throw new InternalServerErrorException(`Could not read file: ${error.message}`);
    }
  }

  /**
   * Reads the JSON file data and stores it in Redis in sorted sets, whilst keeping track
   * of the scores of each entry/collection.
   * The score is the number of followers.
   */
  async loadEntriesIntoCache() {
    // first clean all existing entries
    const collectionKeys = await this.redis.keys(`${RedisRootKey.collection}-*`);
    const entryKeys = await this.redis.keys(`${RedisRootKey.entry}-*`);

    if (collectionKeys.length > 0) {
      await this.redis.del(...collectionKeys);
    }
    if (entryKeys.length > 0) {
      await this.redis.del(...entryKeys);
    }

    // then load the JSON file data and store it in Redis in sorted sets with scores
    const jsonData: JsonDataObj[] = await this.readJsonFile();

    for (const object of jsonData) {
      await this.redis.zincrby(
        RedisRootKey.entry,
        1,
        object.entry_id,
      );
      await this.redis.zincrby(
        RedisRootKey.collection,
        1,
        object.collection_id,
      );
    }
  }

  /**
   * Returns the 10 most watched entries and collections, in DESC order.
   */
  async getSortedSets() {
    const [resEntries, resCollections] = await Promise.all([
      this.redis.zrevrangebyscore(
        RedisRootKey.entry,
        '+inf',
        '-inf',
        'WITHSCORES',
        'LIMIT',
        0,
        10,
      ),
      this.redis.zrevrangebyscore(
        RedisRootKey.collection,
        '+inf',
        '-inf',
        'WITHSCORES',
        'LIMIT',
        0,
        10,
      ),
    ]);

    const entries = {};
    const collections = {};

    let index = 0;
    while (index < resEntries.length) {
      entries[resEntries[index]] = Number(resEntries[index + 1]);
      collections[resCollections[index]] = Number(resCollections[index + 1]);
      index += 2;
    }

    index = 0;
    while (index < resCollections.length) {
      collections[resCollections[index]] = Number(resCollections[index + 1]);
      index += 2;
    }

    return { entries, collections };
  }
}
