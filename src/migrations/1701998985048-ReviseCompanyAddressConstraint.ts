import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1701998985048 implements MigrationInterface {
  name = 'Migrations1701998985048';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX \`IDX_3737905699894299444476dd79\` ON \`company\``,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE UNIQUE INDEX \`IDX_3737905699894299444476dd79\` ON \`company\` (\`addressId\`)`,
    );
  }
}
