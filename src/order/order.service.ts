import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderEntity, OrderQuoteType } from './order.entity';
import { CreateOrderInput } from './dto/create-order-input.dto';
import { Order } from '../nft-data-provider/types';
import { CollectionEntity } from '../collection/collection.entity';
import { ItemEntity } from '../item/item.entity';

@Injectable()
export class OrderService {
  private readonly logger: Logger;

  constructor(
    @InjectRepository(OrderEntity) private orderEntity: Repository<OrderEntity>,
  ) {
    this.logger = new Logger(OrderService.name);
  }

  /**
   * Creates a new order record in the DB
   *
   * @param {CreateOrderInput}  order
   * @param {string}            maker
   * @param {CollectionEntity}  collection
   * @param {ItemEntity?} item
   * @return  {Promise<OrderEntity>}
   */
  async create(
    order: Order,
    maker: string,
    collection: CollectionEntity,
    item?: ItemEntity | null,
  ): Promise<OrderEntity> {
    const itemId = item ? item.id : null;

    const existingOrder = await this.orderEntity.findOne({
      where: { collectionId: collection.id, orderId: order.id },
    });
    if (existingOrder) {
      this.logger.debug('Duplicate order', {
        collectionId: collection.id,
        item,
        existingOrder,
        order,
      });
      return existingOrder;
    }

    try {
      return this.orderEntity
        .create({
          orderId: order.id,
          hash: order.hash,
          quoteType: order.quoteType,
          collectionId: collection.id,
          collectionType: order.collectionType,
          startTime: order.startTime,
          endTime: order.endTime,
          price: order.price,
          itemId,
          makerAddress: maker,
        })
        .save();
    } catch (err) {
      this.logger.error('Could not create new order record', {
        collectionId: collection.id,
        itemId,
        errMsg: err.message,
      });
      throw err;
    }
  }
}
