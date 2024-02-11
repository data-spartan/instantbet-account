import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  RedisModuleOptions,
  RedisModuleOptionsFactory,
} from '@nestjs-modules/ioredis';
import { RedisConfigEnum } from '../types/redis.type';

@Injectable()
export class RedisConfigService implements RedisModuleOptionsFactory {
  constructor(private readonly config: ConfigService) {}

  createRedisModuleOptions(): RedisModuleOptions | Promise<RedisModuleOptions> {
    return {
      type: this.config.get<any>(RedisConfigEnum.REDIS_TYPE),
      options: {
        db: process.env.NODE_ENV === 'test' ? 1 : 0,
        host: this.config.get<string>(RedisConfigEnum.REDIS_HOST),
        port: +this.config.get<number>(RedisConfigEnum.REDIS_PORT),
        password: this.config.get<string>(RedisConfigEnum.REDIS_PASSWORD),
      },
    };
  }
}
