import { InjectRedis } from '@nestjs-modules/ioredis';
import { Injectable, Logger } from '@nestjs/common';
import Redis from 'ioredis';
import {
  FORGOT_PASSWORD_EXPIRES,
  REFRESH_TOKENS_EXPIRES,
  VERIFY_EMAIL_EXPIRES,
  VERIFY_EMAIL_PREFIX,
  VERIFY_TELEPHONE_EXPIRES,
  VERIFY_TELEPHONE_PREFIX,
} from './redisCache.consts';
import { RedisHashesEnum } from './interfaces/redis.enum';

@Injectable()
export class RedisCacheService {
  constructor(
    @InjectRedis()
    private readonly connection: Redis,
    private readonly logger: Logger,
  ) {}

  public async hsetToken(
    userId: string,
    token: string,
    hashName: RedisHashesEnum,
  ) {
    try {
      await this.connection.hset(`${hashName}:${userId}`, userId, token);
      await this.connection.expire(`${hashName}:${userId}`, 4555);
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

  public async setVerifyEmailToken(userId: string, token: string) {
    try {
      const key = `${VERIFY_EMAIL_PREFIX}${userId}`;
      this.connection.set(key, token, 'EX', VERIFY_EMAIL_EXPIRES);
    } catch (e) {
      throw e;
    }
  }

  public async getVerifyEmailToken(userId: string) {
    try {
      const key = `${VERIFY_EMAIL_PREFIX}${userId}`;
      return await this.connection.get(key);
    } catch (e) {
      throw e;
    }
  }

  public async deleteVerifyEmailToken(userId: string) {
    try {
      const key = `${VERIFY_EMAIL_PREFIX}${userId}`;
      this.connection.del(key);
    } catch (e) {
      throw e;
    }
  }

  public async setVerifyTelephoneToken(userId: string, token: string) {
    try {
      const key = `${VERIFY_TELEPHONE_PREFIX}${userId}`;
      this.connection.set(key, token, 'EX', VERIFY_TELEPHONE_EXPIRES);
    } catch (e) {
      throw e;
    }
  }

  public async getVerifyTelephoneToken(userId: string) {
    try {
      const key = `${VERIFY_TELEPHONE_PREFIX}${userId}`;
      return await this.connection.get(key);
    } catch (e) {
      throw e;
    }
  }

  public async deleteVerifyTelephoneToken(userId: string) {
    try {
      const key = `${VERIFY_TELEPHONE_PREFIX}${userId}`;
      this.connection.del(key);
    } catch (e) {
      throw e;
    }
  }
}
