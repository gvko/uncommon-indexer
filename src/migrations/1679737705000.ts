import { MigrationInterface, QueryRunner } from 'typeorm';

export class migrations1679737705000 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE items
      ADD CONSTRAINT unique_collection_token_ids
      UNIQUE (collection_id, token_id);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`drop constraint "unique_collection_token_ids"`);
  }

}
