import { MigrationInterface, QueryRunner } from 'typeorm';

export class RenameAddressTable1700675173141 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query('ALTER TABLE adress RENAME TO address');
    queryRunner.query(
      'ALTER TABLE company RENAME COLUMN adressId TO addressId',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`ALTER TABLE address RENAME TO adress`);
    queryRunner.query(
      'ALTER TABLE company RENAME COLUMN addressId TO adressId',
    );
  }
}
