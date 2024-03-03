import { ConfigService } from '@nestjs/config';
import * as dotenv from 'dotenv';
import * as path from 'path';
import type { DataSourceOptions } from 'typeorm';
import type { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { TypeORMConfigEnum } from './typeorm.enum';

dotenv.config({
  path: path.resolve(process.cwd(), `.env`),
});

export const getEnvTypeOrmConfig = (): DataSourceOptions => ({
  type: process.env.DATABASE_TYPE as PostgresConnectionOptions['type'],
  host: process.env.DATABASE_HOSTNAME,
  port: parseInt(process.env.DATABASE_PORT),
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
});

export const getConfigServiceTypeOrmConfig = (
  configService: ConfigService,
): DataSourceOptions => {
  const db =
    process.env.NODE_ENV !== 'test'
      ? configService.get<string>(TypeORMConfigEnum.DATABASE_NAME)
      : configService
          .get<string>(TypeORMConfigEnum.DATABASE_NAME)
          .concat('-', 'test');
  return {
    type: configService.get<PostgresConnectionOptions['type']>(
      TypeORMConfigEnum.DATABASE_TYPE,
    ),
    database: db,
    host: configService.get<string>(TypeORMConfigEnum.DATABASE_HOSTNAME),
    port: Number(configService.get<string>(TypeORMConfigEnum.DATABASE_PORT)),
    username: configService.get<string>(TypeORMConfigEnum.DATABASE_USERNAME),
    password: configService.get<string>(TypeORMConfigEnum.DATABASE_PASSWORD),
  };
};
