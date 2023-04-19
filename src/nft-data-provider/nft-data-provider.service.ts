import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { CollectionService } from '../collection/collection.service';
import { ItemService } from '../item/item.service';
import { OrderService } from '../order/order.service';
import { CollectionStats, ListingsData, LooksRareApiResponse, OffersData } from './types';

export enum EventType {
  LIST = 'LIST',
  OFFER = 'OFFER',
}

enum ApiEndpoints {
  events = 'events',
  collectionStats = 'collections/stats',
}

@Injectable()
export class NftDataProviderService {
  private readonly logger: Logger;
  private readonly apiUrlV1: string;
  private readonly apiUrlV2: string;

  constructor(
    @Inject(forwardRef(() => CollectionService))
    private readonly collectionService: CollectionService,
    private readonly itemService: ItemService,
    private readonly orderService: OrderService,
  ) {
    this.logger = new Logger(NftDataProviderService.name);
    this.apiUrlV1 = 'https://api.looksrare.org/api/v1';
    this.apiUrlV2 = 'https://api.looksrare.org/api/v2';
  }

  private async callApiGet(
    apiUrl: string,
    endpoint: ApiEndpoints,
    params: any,
  ): Promise<LooksRareApiResponse> {
    const url = `${apiUrl}/${endpoint}`;
    const options = {
      headers: {
        Accept: 'application/json',
      },
      params,
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

  private async getEvents(
    collectionAddress: string,
    eventType: EventType,
  ): Promise<ListingsData[] | OffersData[]> {
    const apiResponse = await this.callApiGet(this.apiUrlV2, ApiEndpoints.events, {
      collection: collectionAddress,
      type: eventType,
    });
    return apiResponse.data as ListingsData[] | OffersData[];
  }

  async getCollectionStats(collectionAddress: string): Promise<CollectionStats> {
    const apiResponse = await this.callApiGet(this.apiUrlV1, ApiEndpoints.collectionStats, {
      address: collectionAddress,
    });
    return apiResponse.data as CollectionStats;
  }

  async getAndStoreListings(collectionAddress: string) {
    const listings = (await this.getEvents(collectionAddress, EventType.LIST)) as ListingsData[];

    // TODO: can be optimized to store in bulk
    for (const listing of listings) {
      const collection = await this.collectionService.create(listing.collection);
      const item = await this.itemService.create(listing.token, collection);
      await this.orderService.create(listing.order, listing.from, collection, item);
    }
  }

  async getAndStoreOffers(collectionAddress: string) {
    const offers = (await this.getEvents(collectionAddress, EventType.OFFER)) as OffersData[];

    // TODO: can be optimized to store in bulk
    for (const offer of offers) {
      const collection = await this.collectionService.create(offer.collection);
      await this.orderService.create(offer.order, offer.from, collection);
    }
  }
}
