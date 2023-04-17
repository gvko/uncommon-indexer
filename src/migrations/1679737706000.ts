import { MigrationInterface, QueryRunner } from 'typeorm';

export class migrations1679737706000 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        order_id INTEGER,
        hash varchar,
        quoteType INTEGER,
        collection_id BIGINT NOT NULL,
        collectionType INTEGER,
        start_time INTEGER,
        end_time INTEGER,
        price varchar,
        item_id BIGINT NOT NULL,
        maker_address varchar,
        created_at timestamp with time zone NOT NULL DEFAULT now(),
        updated_at timestamp with time zone NOT NULL DEFAULT now(),
        FOREIGN KEY (collection_id) REFERENCES collections(id) ON DELETE CASCADE,
        FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE CASCADE,
        CONSTRAINT order_collection_id_token_id_unique UNIQUE (collection_id, order_id)
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`drop table "orders"`);
  }

}
