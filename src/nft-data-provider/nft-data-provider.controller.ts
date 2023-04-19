import { Controller, Get, Param, Post } from '@nestjs/common';
import { NftDataProviderService } from './nft-data-provider.service';

@Controller('nft-data')
export class NftDataProviderController {
  constructor(private nftDataProviderService: NftDataProviderService) {
  }

  @Post(':collectionAddress')
  async populateNftData(@Param('collectionAddress') collectionAddress: string): Promise<void> {
    await Promise.all([
      this.nftDataProviderService.getAndStoreListings(collectionAddress),
      this.nftDataProviderService.getAndStoreOffers(collectionAddress),
    ]);
  }

  @Get(':collectionAddress')
  async getCollectionStats(@Param('collectionAddress') collectionAddress: string): Promise<any> {
    return this.nftDataProviderService.getCollectionStats(collectionAddress);
  }
}
