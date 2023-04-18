import { Module } from '@nestjs/common';
import { NftDataProviderService } from './nft-data-provider.service';
import { CollectionModule } from '../collection/collection.module';
import { ItemModule } from '../item/item.module';
import { OrderModule } from '../order/order.module';
import { NftDataProviderController } from './nft-data-provider.controller';

@Module({
  imports: [CollectionModule, ItemModule, OrderModule],
  controllers: [NftDataProviderController],
  providers: [NftDataProviderService],
  exports: [NftDataProviderService],
})
export class NftDataProviderModule {
}
