import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
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
    const possibleOrderTypes = Object.values(EventType);
    if (!possibleOrderTypes.includes(type)) {
      throw new BadRequestException(`Order type '${type}' is not valid. Allowed values: ${possibleOrderTypes}`);
    }
    const orderType = type === EventType.LIST ? OrderQuoteType.Ask : OrderQuoteType.Bid;
    // TODO: input validation for the rest of the query params

    const orders = await this.orderService.getOrders(orderType, { minPrice, maxPrice, offset });
    return {
      count: orders.length,
      orders,
    };
  }
}
