import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderEntity } from './order.entity';
import { CreateOrderInput } from './dto/create-order-input.dto';

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
   * @param {CreateOrderInput}  dto
   * @return  {Promise<OrderEntity>}
   */
  async create(dto: CreateOrderInput): Promise<OrderEntity> {
    return this.orderEntity
      .create({
        orderId: dto.orderId,
        hash: dto.hash,
        quoteType: dto.quoteType,
        collectionId: dto.collectionId,
        collectionType: dto.collectionType,
        startTime: dto.startTime,
        endTime: dto.endTime,
        price: dto.price,
        itemId: dto.itemId,
        makerAddress: dto.makerAddress,
      })
      .save();
  }
}
