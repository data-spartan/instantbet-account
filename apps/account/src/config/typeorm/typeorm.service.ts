import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmOptionsFactory, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { TypeORMConfigEnum } from './typeorm.enum';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { entities } from '@app/common/entities/api.entities';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private readonly config: ConfigService) {}
  createTypeOrmOptions(): TypeOrmModuleOptions {
    const enviroment = process.env.NODE_ENV;
    const db_hostname =
      enviroment !== 'production' ? 'localhost' : process.env.DATABASE_HOSTNAME;
    const baseDB = this.config.get<string>(TypeORMConfigEnum.DATABASE_NAME);
    const db = enviroment !== 'test' ? baseDB : baseDB.concat('-', 'test');
    return {
      type: this.config.get<PostgresConnectionOptions['type']>(
        TypeORMConfigEnum.DATABASE_TYPE,
      ),
      database: db,
      host: db_hostname,
      port: +this.config.get<string>(TypeORMConfigEnum.DATABASE_PORT),
      username: this.config.get<string>(TypeORMConfigEnum.DATABASE_USERNAME),
      password: this.config.get<string>(TypeORMConfigEnum.DATABASE_PASSWORD),
      logging: false,
      synchronize: true,
      entities: entities,
      autoLoadEntities: true,
      poolSize: 20,
    };
  }
}
