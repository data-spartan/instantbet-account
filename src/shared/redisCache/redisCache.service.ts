import { InjectRedis } from '@nestjs-modules/ioredis';
import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import {
  FORGOT_PASSWORD_EXPIRES,
  VERIFY_EMAIL_EXPIRES,
  VERIFY_EMAIL_PREFIX,
  VERIFY_TELEPHONE_EXPIRES,
  VERIFY_TELEPHONE_PREFIX,
} from './redisCache.consts';

@Injectable()
export class RedisCacheService {
  constructor(
    @InjectRedis()
    private readonly connection: Redis,
  ) {}

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
