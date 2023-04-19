import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, MoreThanOrEqual, Repository } from 'typeorm';
import { OrderEntity, OrderQuoteType } from './order.entity';
import { CreateOrderInput } from './dto/create-order-input.dto';
import { Order } from '../nft-data-provider/types';
import { CollectionEntity } from '../collection/collection.entity';
import { ItemEntity } from '../item/item.entity';

interface GetOrdersQueryParams {
  minPrice?: number;
  maxPrice?: number;
  offset?: number;
}

// export interface OrdersResult {
//
// }

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

  async getOrders(
    type: OrderQuoteType,
    { minPrice, maxPrice, offset }: GetOrdersQueryParams,
  ): Promise<any[]> {
    const currentTimestampSec = Math.floor(Date.now() / 1000);
    const orderBy = type === OrderQuoteType.Ask ? 'ASC' : 'DESC';
    const queryBuilder = this.orderEntity.createQueryBuilder('order');

    queryBuilder
      .where('order.quoteType = :type', { type })
      .andWhere('order.endTime > :currentTimestampSec', { currentTimestampSec });

    if (minPrice) {
      queryBuilder.andWhere('order.price >= :minPrice', { minPrice });
    }
    if (maxPrice) {
      queryBuilder.andWhere('order.price <= :maxPrice', { maxPrice });
    }

    queryBuilder
      .leftJoinAndSelect('order.collection', 'collection')
      .leftJoinAndSelect('order.item', 'item');

    if (offset) {
      queryBuilder.offset(offset);
    }

    queryBuilder.addOrderBy('order.price', orderBy);
    // Always limit the result to 10 records
    queryBuilder.limit(10);

    const ordersDbResult = await queryBuilder.getMany();

    return ordersDbResult;
  }
}
