import { InjectRedis } from '@nestjs-modules/ioredis';
import { Injectable, Logger } from '@nestjs/common';
import Redis from 'ioredis';
import {
  FORGOT_PASSWORD_EXPIRES,
  VERIFY_EMAIL_EXPIRES,
} from './redisCache.consts';
import { RedisHashesEnum } from '../types/redis.type';

@Injectable()
export class RedisCacheService {
  constructor(
    @InjectRedis()
    private readonly connection: Redis,
    private readonly logger: Logger,
  ) {}

  public async hsetForgotPasswordToken(
    userId: string,
    token: string,
    hashName: RedisHashesEnum,
  ) {
    try {
      await this.connection.hset(`${hashName}:${userId}`, userId, token);
      await this.connection.expire(
        `${hashName}:${userId}`,
        FORGOT_PASSWORD_EXPIRES,
      );
    } catch (e) {
      throw e;
    }
  }

  public async hsetVerifyEmailToken(
    userId: string,
    token: string,
    hashName: RedisHashesEnum,
  ) {
    try {
      await this.connection.hset(`${hashName}:${userId}`, userId, token);
      await this.connection.expire(
        `${hashName}:${userId}`,
        VERIFY_EMAIL_EXPIRES,
      );
    } catch (e) {
      throw e;
    }
  }

  public async hgetToken(userId: string, hashName: RedisHashesEnum) {
    try {
      return await this.connection.hget(`${hashName}:${userId}`, userId);
    } catch (e) {
      throw e;
    }
  }
  public async hgetallToken(userId: string, hashName: RedisHashesEnum) {
    try {
      return await this.connection.hgetall(`${hashName}:${userId}`);
    } catch (e) {
      throw e;
    }
  }

  public async deleteToken(userId: string, hashName: RedisHashesEnum) {
    try {
      await this.connection.del(`${hashName}:${userId}`);
    } catch (e) {
      throw e;
    }
  }

  public async setForgetPasswordToken(userId: string, token: string) {
    try {
      const key = `${FORGOT_PASSWORD_EXPIRES}${token}`;
      this.connection.set(key, userId, 'EX', FORGOT_PASSWORD_EXPIRES);
    } catch (e) {
      throw e;
    }
  }

  public async getForgetPasswordToken(token: string) {
    try {
      const key = `${FORGOT_PASSWORD_EXPIRES}${token}`;
      return await this.connection.get(key);
    } catch (e) {
      throw e;
    }
  }

  public async deleteForgetPasswordToken(token: string) {
    try {
      const key = `${FORGOT_PASSWORD_EXPIRES}${token}`;
      this.connection.del(key);
    } catch (e) {
      throw e;
    }
  }
}
