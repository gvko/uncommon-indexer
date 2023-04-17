import { MigrationInterface, QueryRunner } from 'typeorm';

export class migrations1679737704000 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE items (
        id SERIAL PRIMARY KEY,
        token_id INTEGER,
        name varchar,
        collection_id BIGINT NOT NULL,
        created_at timestamp with time zone NOT NULL DEFAULT now(),
        updated_at timestamp with time zone NOT NULL DEFAULT now(),
        FOREIGN KEY (collection_id) REFERENCES collections(id) ON DELETE CASCADE
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`drop table "items"`);
  }

}
