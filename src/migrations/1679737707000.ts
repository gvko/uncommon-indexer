import { MigrationInterface, QueryRunner } from 'typeorm';

export class migrations1679737707000 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE INDEX order_quote_type_end_time_idx ON orders (quote_type, end_time);
    `);
    await queryRunner.query(`
        CREATE INDEX order_quote_type_end_time_price_idx ON orders (quote_type, end_time, price);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`drop index "order_quote_type_end_time_idx"`);
    await queryRunner.query(`drop index "order_quote_type_end_time_price_idx"`);
  }

}
