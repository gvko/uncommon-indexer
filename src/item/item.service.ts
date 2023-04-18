import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ItemEntity } from './item.entity';
import { CreateItemInput } from './dto/create-item-input.dto';
import { Token } from '../nft-data-provider/types';
import { CollectionEntity } from '../collection/collection.entity';

@Injectable()
export class ItemService {
  private readonly logger: Logger;

  constructor(
    @InjectRepository(ItemEntity) private itemEntity: Repository<ItemEntity>,
  ) {
    this.logger = new Logger(ItemService.name);
  }

  /**
   * Creates a new item record in the DB
   *
   * @param {CreateItemInput}   item
   * @param {CollectionEntity}  collection
   * @return  {Promise<ItemEntity>}
   */
  async create(item: Token, collection: CollectionEntity): Promise<ItemEntity> {
    const existingItem = await this.itemEntity.findOne({
      where: { tokenId: Number(item.tokenId), collectionId: collection.id },
    });
    if (existingItem) {
      this.logger.debug('Duplicate item', { collectionId: collection.id, existingItem, item });
      return existingItem;
    }

    return this.itemEntity
      .create({
        tokenId: Number(item.tokenId),
        name: item.name,
        collectionId: collection.id,
      })
      .save();
  }
}
