import { MigrationInterface, QueryRunner } from 'typeorm';

export class migrations1679737703000 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "collections" (
      "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
      "address" varchar NOT NULL,
      "owner" varchar NOT NULL,
      "setter" varchar NOT NULL,
      "name" varchar NOT NULL,
      "symbol" varchar NOT NULL,
      "type" "token_standard",
      "created_at" TIMESTAMP NOT NULL DEFAULT now(),
      "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
      CONSTRAINT "PK_abcdef1234567890" PRIMARY KEY ("id"),
      CONSTRAINT "UQ_collection_address" UNIQUE ("address"));
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`drop table "collections"`);
  }

}
