import { MigrationInterface, QueryRunner } from 'typeorm';

export class migrations1679737705100 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TYPE order_quote_type AS ENUM ('1', '0');
      CREATE TYPE order_collection_type AS ENUM ('0', '1');
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`drop type "order_collection_type"`);
    await queryRunner.query(`drop type "order_quote_type"`);
  }

}
