import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderEntity } from './order.entity';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { NftDataProviderModule } from '../nft-data-provider/nft-data-provider.module';

@Module({
  imports: [TypeOrmModule.forFeature([OrderEntity]), forwardRef(() => NftDataProviderModule)],
  controllers: [OrderController],
  providers: [OrderService],
  exports: [OrderService],
})
export class OrderModule {
}
