import { forwardRef, Module } from '@nestjs/common';
import { LooksrareProviderService } from './looksrare-provider.service';
import { CollectionModule } from '../collection/collection.module';

@Module({
  imports: [forwardRef(() => CollectionModule)],
  providers: [LooksrareProviderService],
  exports: [LooksrareProviderService],
})
export class LooksrareProviderModule {
}
