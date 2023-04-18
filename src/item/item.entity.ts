import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Unique,
  ManyToOne,
  JoinColumn,
  BaseEntity,
} from 'typeorm';
import { CollectionEntity } from '../collection/collection.entity';

@Entity('items')
@Unique(['collectionId', 'tokenId'])
export class ItemEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'integer', name: 'token_id' })
  tokenId: number;

  @Column('varchar')
  name: string;

  @ManyToOne(() => CollectionEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'collection_id' })
  collection: CollectionEntity;
  @Column({ type: 'bigint', nullable: false, name: 'collection_id' })
  collectionId: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date = new Date();

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date = new Date();
}
