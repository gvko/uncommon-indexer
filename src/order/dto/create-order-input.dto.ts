import { OrderCollectionType, OrderQuoteType } from '../order.entity';

export class CreateOrderInput {
  readonly orderId: string;
  readonly hash: string;
  readonly quoteType: OrderQuoteType;
  readonly collectionId: number;
  readonly collectionType: OrderCollectionType;
  readonly startTime: number;
  readonly endTime: number;
  readonly price: string;
  readonly itemId: number;
  readonly makerAddress: string;
}
