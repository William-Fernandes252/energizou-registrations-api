import { registerAs } from '@nestjs/config';
import { config } from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';

config({ path: `.env.${process.env.NODE_ENV}` });

const dataSourceOptions: DataSourceOptions = {
  type: 'mysql',
  host: process.env.DATABASE_HOST,
  port: +process.env.DATABASE_PORT,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  migrations: ['dist/src/migrations/*.js'],
  entities: ['dist/**/entities/*.entity.js'],
  synchronize: ['test'].includes(process.env.NODE_ENV),
};

export default registerAs('database', () => dataSourceOptions);

export const connectionSource = new DataSource(dataSourceOptions);
