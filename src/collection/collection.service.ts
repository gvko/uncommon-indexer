import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CollectionEntity } from './collection.entity';
import { CreateCollectionInput } from './dto/create-collection-input.dto';
import { Collection } from '../nft-data-provider/types';

@Injectable()
export class CollectionService {
  private readonly logger: Logger;

  constructor(
    @InjectRepository(CollectionEntity) private collectionEntity: Repository<CollectionEntity>,
  ) {
    this.logger = new Logger(CollectionService.name);
  }

  /**
   * Creates a new collection record in the DB, if one with the same address does not exist already
   *
   * @param {CreateCollectionInput}  collection
   * @return  {Promise<CollectionEntity>}
   */
  async create(collection: Collection): Promise<CollectionEntity> {
    // TODO: Can be optimized to search in bulk
    const existingCollection = await this.collectionEntity.findOne({
      where: { address: collection.address },
    });
    if (existingCollection) {
      return existingCollection;
    }

    return this.collectionEntity
      .create({
        address: collection.address,
        owner: collection.owner,
        setter: collection.setter,
        name: collection.name,
        symbol: collection.symbol,
        type: collection.type,
      })
      .save();
  }
}
