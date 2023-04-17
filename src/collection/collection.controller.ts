import { Controller} from '@nestjs/common';
import { CollectionService } from './collection.service';

@Controller('transactions')
export class CollectionController {
  constructor(private collectionService: CollectionService) {
  }

}
