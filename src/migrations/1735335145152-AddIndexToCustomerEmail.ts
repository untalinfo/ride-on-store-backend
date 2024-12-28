import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddIndexToCustomerEmail1616161616161
  implements MigrationInterface
{
  name = 'AddIndexToCustomerEmail1616161616161';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE INDEX "IDX_customer_email" ON "customer" ("email")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_customer_email"`);
  }
}
