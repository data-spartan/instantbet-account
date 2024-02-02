import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  RedisModuleOptions,
  RedisModuleOptionsFactory,
} from '@nestjs-modules/ioredis';
import { RedisConfigEnum } from './interfaces/redis.enum';

@Injectable()
export class RedisConfigService implements RedisModuleOptionsFactory {
  @Inject(ConfigService)
  private readonly config: ConfigService;

  onModuleInit() {
    console.warn(`### Redis Service Module ###`);
    console.warn(`Redis Module Initiated.`);
    console.warn(`### Redis Service Module END ###`);
  }

  createRedisModuleOptions(): RedisModuleOptions | Promise<RedisModuleOptions> {
    return {
      type: this.config.get<any>(RedisConfigEnum.REDIS_TYPE),
      options: {
        host: this.config.get<string>(RedisConfigEnum.REDIS_HOST),
        port: +this.config.get<number>(RedisConfigEnum.REDIS_PORT),
        password: this.config.get<string>(RedisConfigEnum.REDIS_PASSWORD),
      },
    };
  }
}
