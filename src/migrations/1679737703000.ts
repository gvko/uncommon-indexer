import { MigrationInterface, QueryRunner } from 'typeorm';

export class migrations1679737703000 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "collections" (
      "id" SERIAL PRIMARY KEY,
      "address" varchar NOT NULL,
      "owner" varchar NOT NULL,
      "setter" varchar NOT NULL,
      "name" varchar NOT NULL,
      "symbol" varchar NOT NULL,
      "type" "token_standard",
      "created_at" TIMESTAMP NOT NULL DEFAULT now(),
      "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
      CONSTRAINT "unique_collection_address" UNIQUE ("address"));
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`drop table "collections"`);
  }

}
