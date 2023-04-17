import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';

export enum EventType {
  LIST = 'LIST',
  OFFER = 'OFFER',
}

@Injectable()
export class LooksrareProviderService {
  private readonly logger: Logger;
  private readonly apiUrl: string;

  constructor() {
    this.logger = new Logger(LooksrareProviderService.name);
    this.apiUrl = 'https://api.looksrare.org/api/v2';
  }

  async getListings(collectionAddress: string) {
    return this.getEvents(collectionAddress, EventType.LIST);
  }

  async getOffers(collectionAddress: string) {
    return this.getEvents(collectionAddress, EventType.OFFER);
  }

  async getEvents(collectionAddress: string, eventType: EventType) {
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
}
