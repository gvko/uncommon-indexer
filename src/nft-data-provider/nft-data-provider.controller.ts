import { Controller, Get, Param, Post } from '@nestjs/common';
import { NftDataProviderService } from './nft-data-provider.service';

@Controller('nft-data')
export class NftDataProviderController {
  constructor(private nftDataProviderService: NftDataProviderService) {
  }

  @Post(':collectionAddress')
  async populateNftData(@Param('collectionAddress') collectionAddress: string): Promise<string> {
    await Promise.all([
      this.nftDataProviderService.getAndStoreListings(collectionAddress),
      this.nftDataProviderService.getAndStoreOffers(collectionAddress),
    ]);

    return 'OK';
  }

  @Get(':collectionAddress')
  async getCollectionStats(@Param('collectionAddress') collectionAddress: string): Promise<any> {
    return this.nftDataProviderService.getCollectionStats(collectionAddress);
  }
}
