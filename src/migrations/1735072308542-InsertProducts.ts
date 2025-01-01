import { MigrationInterface, QueryRunner } from 'typeorm';

export class InsertProducts1735072308542 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        INSERT INTO "product" (title, description, image, price, stock, created_at)
        VALUES
          ('ICHIBAN Electric 2032', 'Ichiban isn''t simply a mode of transport; it''s an escape, a liberating streak of freedom in an excessively interconnected world.', 'https://ride-on-store.s3.us-east-2.amazonaws.com/ichiban.png', 3400000, 10, NOW()),
          ('CXTBR', 'High-performance motorcycle for thrill-seekers and speed enthusiasts.', 'https://ride-on-store.s3.us-east-2.amazonaws.com/cxbtr.png', 4800000, 10, NOW()),
          ('MBWS', 'Reliable and versatile motorcycle, perfect for both urban and off-road adventures.', 'https://ride-on-store.s3.us-east-2.amazonaws.com/mbws.png', 2200000, 10, NOW()),
          ('Jaguar', 'A classic motorcycle with modern enhancements for an unmatched riding experience.', 'https://ride-on-store.s3.us-east-2.amazonaws.com/jaguar.png', 2800000, 10, NOW());
      `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
          DELETE FROM "product" WHERE id IN (1, 2, 3, 4);
        `);
  }
}
