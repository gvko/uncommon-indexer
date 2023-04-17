import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { config } from './common/config';
import ormConfig from './common/orm-config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CollectionModule } from './collection/collection.module';
import { LooksrareProviderModule } from './looksrare-provider/looksrare-provider.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [config],
    }),
    TypeOrmModule.forRoot(ormConfig),
    CollectionModule,
    LooksrareProviderModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
}
