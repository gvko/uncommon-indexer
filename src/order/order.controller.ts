import { Controller, Get, Query } from '@nestjs/common';
import { OrderResult, OrderService } from './order.service';
import { EventType } from '../nft-data-provider/nft-data-provider.service';
import { OrderQuoteType } from './order.entity';

@Controller('orders')
export class OrderController {
  constructor(private orderService: OrderService) {
  }

  @Get()
  async getOrders(
    @Query('type') type: EventType,
    @Query('minPrice') minPrice: number,
    @Query('maxPrice') maxPrice: number,
    @Query('offset') offset: number,
  ): Promise<{ count: number; orders: OrderResult[] }> {
    // TODO: input validation
    const orderType = type === EventType.LIST ? OrderQuoteType.Ask : OrderQuoteType.Bid;

    const orders = await this.orderService.getOrders(orderType, { minPrice, maxPrice, offset });
    return {
      count: orders.length,
      orders,
    };
  }
}
