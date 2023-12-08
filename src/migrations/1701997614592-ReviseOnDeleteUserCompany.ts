import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1701997614592 implements MigrationInterface {
  name = 'Migrations1701997614592';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`company\` DROP FOREIGN KEY \`FK_7a6be8e609d00271752085febe1\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`company\` DROP FOREIGN KEY \`FK_936e148b1a78b48d8a2bfb1ce47\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_ae1bd1037b9394e8decfc61ec3\` ON \`address\``,
    );
    await queryRunner.query(
      `DROP INDEX \`REL_936e148b1a78b48d8a2bfb1ce4\` ON \`company\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`company\` ADD UNIQUE INDEX \`IDX_3737905699894299444476dd79\` (\`addressId\`)`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX \`IDX_85ac3c83be9934cfdcec94ac52\` ON \`address\` (\`number\`, \`street\`, \`cep\`)`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX \`REL_3737905699894299444476dd79\` ON \`company\` (\`addressId\`)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`company\` ADD CONSTRAINT \`FK_7a6be8e609d00271752085febe1\` FOREIGN KEY (\`representativeId\`) REFERENCES \`user\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`company\` ADD CONSTRAINT \`FK_3737905699894299444476dd79c\` FOREIGN KEY (\`addressId\`) REFERENCES \`address\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`company\` DROP FOREIGN KEY \`FK_3737905699894299444476dd79c\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`company\` DROP FOREIGN KEY \`FK_7a6be8e609d00271752085febe1\``,
    );
    await queryRunner.query(
      `DROP INDEX \`REL_3737905699894299444476dd79\` ON \`company\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_85ac3c83be9934cfdcec94ac52\` ON \`address\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`company\` DROP INDEX \`IDX_3737905699894299444476dd79\``,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX \`REL_936e148b1a78b48d8a2bfb1ce4\` ON \`company\` (\`addressId\`)`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX \`IDX_ae1bd1037b9394e8decfc61ec3\` ON \`address\` (\`number\`, \`street\`, \`cep\`)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`company\` ADD CONSTRAINT \`FK_936e148b1a78b48d8a2bfb1ce47\` FOREIGN KEY (\`addressId\`) REFERENCES \`address\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`company\` ADD CONSTRAINT \`FK_7a6be8e609d00271752085febe1\` FOREIGN KEY (\`representativeId\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }
}
