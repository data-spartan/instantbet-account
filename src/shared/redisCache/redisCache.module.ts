import { Module } from '@nestjs/common';
import { RedisModule } from '@nestjs-modules/ioredis';
import { RedisConfigService } from './redisConfig.service';
import { RedisCacheService } from './redisCache.service';

@Module({
  imports: [
    RedisModule.forRootAsync({
      useClass: RedisConfigService,
    }),
  ],
  providers: [RedisCacheService],
  exports: [RedisCacheService],
})
export class RedisCacheModule {}
