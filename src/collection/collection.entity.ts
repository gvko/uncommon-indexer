import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

export enum TOKEN_STANDARD {
  ERC721 = 'ERC721',
  ERC1155 = 'ERC1155',
}

@Entity('collections')
export class CollectionEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column('varchar')
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  @Unique('collection_address')
  address: string;

  @Column('varchar')
  owner: string;

  @Column('varchar')
  setter: string;

  @Column('varchar')
  name: string;

  @Column('varchar')
  symbol: string;

  @Column({
    type: 'enum',
    enum: [Object.values(TOKEN_STANDARD)],
    name: 'token_standard',
    nullable: true,
  })
  type: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date = new Date();

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date = new Date();
}
