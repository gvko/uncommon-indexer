import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { CollectionService } from '../collection/collection.service';
import { ItemService } from '../item/item.service';
import { OrderService } from '../order/order.service';
import { LooksRareApiResponse } from './types';

export enum EventType {
  LIST = 'LIST',
  OFFER = 'OFFER',
}

@Injectable()
export class NftDataProviderService {
  private readonly logger: Logger;
  private readonly apiUrl: string;

  constructor(
    private readonly collectionService: CollectionService,
    private readonly itemService: ItemService,
    private readonly orderService: OrderService,
  ) {
    this.logger = new Logger(NftDataProviderService.name);
    this.apiUrl = 'https://api.looksrare.org/api/v2';
  }

  private async getEvents(
    collectionAddress: string,
    eventType: EventType,
  ): Promise<LooksRareApiResponse> {
    const url = `${this.apiUrl}/events`;
    const options = {
      headers: {
        Accept: 'application/json',
      },
      params: {
        collection: collectionAddress,
        type: eventType,
      },
    };
    try {
      const response = await axios.get(url, options);
      return response.data;
    } catch (err) {
      const e = err.response;
      this.logger.error('External API request returned an error', {
        originalMsg: e.statusText,
        originalErr: e.data,
      });
      throw new Error(err);
    }
  }

  async getAndStoreListings(collectionAddress: string) {
    const listings = await this.getEvents(collectionAddress, EventType.LIST);
  }

  async getAndStoreOffers(collectionAddress: string) {
    const offers = await this.getEvents(collectionAddress, EventType.OFFER);
  }
}
