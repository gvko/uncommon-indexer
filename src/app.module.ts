import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { config } from './common/config';
import ormConfig from './common/orm-config';
import redisConfig from './common/redis-config';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CollectionModule } from './collection/collection.module';
import { NftDataProviderModule } from './nft-data-provider/nft-data-provider.module';
import { ItemModule } from './item/item.module';
import { OrderModule } from './order/order.module';
import { CacheModule } from './cache/cache.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [config],
    }),
    TypeOrmModule.forRoot(ormConfig),
    RedisModule.forRoot(redisConfig),
    CollectionModule,
    ItemModule,
    OrderModule,
    NftDataProviderModule,
    CacheModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
}
