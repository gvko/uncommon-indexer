import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ItemEntity } from './item.entity';
import { CreateItemInput } from './dto/create-item-input.dto';

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
   * @param {CreateItemInput}  dto
   * @return  {Promise<ItemEntity>}
   */
  async create(dto: CreateItemInput): Promise<ItemEntity> {
    return this.itemEntity
      .create({
        tokenId: dto.tokenId,
        name: dto.name,
        collectionId: dto.collectionId,
      })
      .save();
  }
}
