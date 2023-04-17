import { TOKEN_STANDARD } from '../collection.entity';

export class CreateCollectionInput {
  readonly address: string;
  readonly owner: string;
  readonly setter: string;
  readonly name: string;
  readonly symbol: string;
  readonly type: TOKEN_STANDARD;
}
