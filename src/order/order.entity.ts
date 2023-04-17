import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  BaseEntity, OneToOne,
} from 'typeorm';
import { CollectionEntity } from '../collection/collection.entity';
import { ItemEntity } from '../item/item.entity';

export enum OrderQuoteType {
  Ask = 1,
  Bid = 0,
}

export enum OrderCollectionType {
  'ERC721' = 0,
  'ERC1155' = 1,
}

@Entity('orders')
export class OrderEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'varchar', name: 'order_id' })
  orderId: string;

  @Column('varchar')
  hash: string;

  @Column({
    type: 'enum',
    enum: [Object.values(OrderQuoteType)],
    name: 'order_quote_type',
    nullable: true,
  })
  quoteType: number;

  @ManyToOne(() => CollectionEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'collectionId' })
  collection: CollectionEntity;
  @Column({
    type: 'bigint',
    nullable: false,
    name: 'collection_id',
  })
  collectionId: number;

  @Column({
    type: 'enum',
    enum: [Object.values(OrderCollectionType)],
    name: 'order_collection_type',
    nullable: true,
  })
  collectionType: number;

  @Column({ type: 'integer', name: 'start_time' })
  startTime: number;

  @Column({ type: 'integer', name: 'end_time' })
  endTime: number;

  @Column('varchar')
  price: string;

  @OneToOne(() => ItemEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'itemId' })
  item: ItemEntity;
  @Column({
    type: 'bigint',
    nullable: false,
    name: 'item_id',
  })
  itemId: number;

  @Column({ type: 'varchar', name: 'maker_address' })
  makerAddress: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date = new Date();

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date = new Date();
}
