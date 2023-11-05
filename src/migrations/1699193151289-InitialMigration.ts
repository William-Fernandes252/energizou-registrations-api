import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1699193151289 implements MigrationInterface {
  name = 'Migration1699193151289';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`adress\` (\`created\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`id\` varchar(36) NOT NULL, \`number\` varchar(3) NOT NULL, \`street\` varchar(255) NOT NULL, \`cep\` varchar(255) NOT NULL, UNIQUE INDEX \`IDX_ae1bd1037b9394e8decfc61ec3\` (\`number\`, \`street\`, \`cep\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`user\` (\`created\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted\` datetime(6) NULL, \`id\` varchar(36) NOT NULL, \`name\` varchar(255) NOT NULL, \`password\` varchar(128) NOT NULL, \`email\` varchar(255) NOT NULL, \`isAdmin\` tinyint NOT NULL, \`companyId\` varchar(36) NULL, UNIQUE INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`company\` (\`created\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`id\` varchar(36) NOT NULL, \`reason\` varchar(255) NOT NULL, \`cnpj\` varchar(14) NOT NULL, \`phone\` varchar(11) NOT NULL, \`representativeId\` varchar(36) NULL, \`adressId\` varchar(36) NULL, UNIQUE INDEX \`IDX_b55d9c6e6adfa3c6de735c5a2e\` (\`cnpj\`), UNIQUE INDEX \`REL_7a6be8e609d00271752085febe\` (\`representativeId\`), UNIQUE INDEX \`REL_936e148b1a78b48d8a2bfb1ce4\` (\`adressId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user\` ADD CONSTRAINT \`FK_86586021a26d1180b0968f98502\` FOREIGN KEY (\`companyId\`) REFERENCES \`company\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`company\` ADD CONSTRAINT \`FK_7a6be8e609d00271752085febe1\` FOREIGN KEY (\`representativeId\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`company\` ADD CONSTRAINT \`FK_936e148b1a78b48d8a2bfb1ce47\` FOREIGN KEY (\`adressId\`) REFERENCES \`adress\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`company\` DROP FOREIGN KEY \`FK_936e148b1a78b48d8a2bfb1ce47\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`company\` DROP FOREIGN KEY \`FK_7a6be8e609d00271752085febe1\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user\` DROP FOREIGN KEY \`FK_86586021a26d1180b0968f98502\``,
    );
    await queryRunner.query(
      `DROP INDEX \`REL_936e148b1a78b48d8a2bfb1ce4\` ON \`company\``,
    );
    await queryRunner.query(
      `DROP INDEX \`REL_7a6be8e609d00271752085febe\` ON \`company\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_b55d9c6e6adfa3c6de735c5a2e\` ON \`company\``,
    );
    await queryRunner.query(`DROP TABLE \`company\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` ON \`user\``,
    );
    await queryRunner.query(`DROP TABLE \`user\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_ae1bd1037b9394e8decfc61ec3\` ON \`adress\``,
    );
    await queryRunner.query(`DROP TABLE \`adress\``);
  }
}
