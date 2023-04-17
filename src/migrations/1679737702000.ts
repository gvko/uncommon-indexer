import { MigrationInterface, QueryRunner } from 'typeorm';

export class migrations1679737702000 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TYPE token_standard AS ENUM ('ERC721', 'ERC1155');`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`drop type "token_standard"`);
  }

}
