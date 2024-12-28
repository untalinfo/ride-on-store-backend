import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangePriceColumnType1735350774088 implements MigrationInterface {
  name = 'ChangePriceColumnType1616161616161';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "product" ALTER COLUMN "price" TYPE integer USING "price"::integer`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "product" ALTER COLUMN "price" TYPE varchar`,
    );
  }
}
