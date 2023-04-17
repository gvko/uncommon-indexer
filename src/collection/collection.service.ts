import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CollectionEntity } from './collection.entity';
import { CreateCollectionInput } from './dto/create-collection-input.dto';

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
   * @param {CreateCollectionInput}  dto
   * @return  {Promise<CollectionEntity>}
   */
  async create(dto: CreateCollectionInput): Promise<CollectionEntity> {
    const existingCollection = this.collectionEntity.findOne({
      where: { address: dto.address },
    });

    if (existingCollection) {
      return existingCollection;
    }

    return this.collectionEntity
      .create({
        address: dto.address,
        owner: dto.owner,
        setter: dto.setter,
        name: dto.name,
        symbol: dto.symbol,
        type: dto.type,
      })
      .save();
  }
}
