import { Controller} from '@nestjs/common';
import { CollectionService } from './collection.service';

@Controller('collections')
export class CollectionController {
  constructor(private collectionService: CollectionService) {
  }

}
