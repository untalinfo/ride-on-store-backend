import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeOrderAmountsTypes1735351461834
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "order" RENAME COLUMN "base_fee" TO "base_fee_in_cents"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" ALTER COLUMN "base_fee_in_cents" TYPE integer USING "base_fee_in_cents"::integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" RENAME COLUMN "delivery_fee" TO "delivery_fee_in_cents"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" ALTER COLUMN "delivery_fee_in_cents" TYPE integer USING "delivery_fee_in_cents"::integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" RENAME COLUMN "total_amount" TO "total_amount_in_cents"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" ALTER COLUMN "total_amount_in_cents" TYPE integer USING "total_amount_in_cents"::integer`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "order" ALTER COLUMN "total_amount_in_cents" TYPE varchar`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" RENAME COLUMN "total_amount_in_cents" TO "total_amount"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" ALTER COLUMN "delivery_fee_in_cents" TYPE varchar`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" RENAME COLUMN "delivery_fee_in_cents" TO "delivery_fee"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" ALTER COLUMN "base_fee_in_cents" TYPE varchar`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" RENAME COLUMN "base_fee_in_cents" TO "base_fee"`,
    );
  }
}
