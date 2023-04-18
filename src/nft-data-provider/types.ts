import { TOKEN_STANDARD } from '../collection/collection.entity';

export interface LooksRareApiResponse {
  success: boolean;
  message: string | null;
  data: ListingsData[] | OffersData[] | null;
  errors: any[];
}

export interface Collection {
  address: string;
  owner: string;
  setter: string;
  name: string;
  symbol: string;
  type: TOKEN_STANDARD;
}

export interface Token {
  tokenId: string; // it's a stringified number
  name: string;
  collectionAddress: string;
}

export interface Order {
  id: string;
  hash: string;
  quoteType: number; // 1 or 0
  collection: string;
  collectionType: number; // 1 or 0
  startTime: number; // timestamp
  endTime: number; // timestamp
  price: string; // stringified long int
  itemIds: string[]; // a single stringified int
}

export interface ListingsData {
  collection: Collection;
  token: null;
  order: Order;
  from: string;
}

export interface OffersData {
  collection: Collection;
  token: Token;
  order: Order;
  from: string;
}
