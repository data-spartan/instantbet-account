import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmOptionsFactory, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { entities } from 'src/api/api.entities';
import { TypeORMConfigEnum } from 'src/constants';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private readonly config: ConfigService) {}
  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: this.config.get<PostgresConnectionOptions['type']>(
        TypeORMConfigEnum.DATABASE_TYPE,
      ),
      database: this.config.get<string>(TypeORMConfigEnum.DATABASE_NAME),
      host: this.config.get<string>(TypeORMConfigEnum.DATABASE_HOSTNAME),
      port: Number(this.config.get<string>(TypeORMConfigEnum.DATABASE_PORT)),
      username: this.config.get<string>(TypeORMConfigEnum.DATABASE_USERNAME),
      password: this.config.get<string>(TypeORMConfigEnum.DATABASE_PASSWORD),
      schema: process.env.NODE_ENV !== 'test' ? 'public' : 'test',
      logging: false,
      synchronize: true,
      entities: entities,
      autoLoadEntities: true,
    };
  }
}
