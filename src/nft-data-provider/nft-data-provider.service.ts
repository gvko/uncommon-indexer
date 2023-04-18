import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { CollectionService } from '../collection/collection.service';
import { ItemService } from '../item/item.service';
import { OrderService } from '../order/order.service';
import { ListingsData, LooksRareApiResponse, OffersData } from './types';

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
    const apiResponse = await this.getEvents(collectionAddress, EventType.LIST);
    const listings = apiResponse.data as ListingsData[];

    // TODO: can be optimized to store in bulk
    for (const listing of listings) {
      const collection = await this.collectionService.create(listing.collection);
      const item = await this.itemService.create(listing.token, collection);
      await this.orderService.create(listing.order, listing.from, collection, item);
    }
  }

  async getAndStoreOffers(collectionAddress: string) {
    const apiResponse = await this.getEvents(collectionAddress, EventType.OFFER);
    const offers = apiResponse.data as OffersData[];

    // TODO: can be optimized to store in bulk
    for (const offer of offers) {
      const collection = await this.collectionService.create(offer.collection);
      await this.orderService.create(offer.order, offer.from, collection);
    }
  }
}
