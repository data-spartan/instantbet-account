import {
  Injectable,
  HttpException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as argon2 from 'argon2';
import * as dayjs from 'dayjs';
import { v4 as uuidv4 } from 'uuid';
import { ConfigService } from '@nestjs/config';
import { RefreshPrivateSecretService } from './refreshKeysLoad.service';
import { RefreshTokenI } from './interfaces';
import { RefreshToken, User } from 'libs/common/src/entities';
import { PostgresTypeOrmQueries } from '@account/database/postgres/queries/postgresTypeorm.query';

@Injectable()
export class AuthHelper {
  // private connection;
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(RefreshToken)
    private readonly tokenRepo: Repository<RefreshToken>,
    private readonly jwt: JwtService,
    private readonly configService: ConfigService,
    private readonly refreshKeysToken: RefreshPrivateSecretService,
    private readonly postgresQueries: PostgresTypeOrmQueries,
  ) {
    this.jwt = jwt;
  }

  public async hashData(data: string) {
    return argon2.hash(data);
  }

  public async verifyData(data1: string, data2: string) {
    return argon2.verify(data1, data2);
  }

  public async validateUser(decoded: any): Promise<User> {
    return this.userRepo.findOne({
      select: {
        id: true,
        email: true,
        role: true,
        verifiedEmail: true,
        avatar: true,
        password: false,
      },
      where: { id: decoded.sub },
    });
  }

  public async validateUserByEmail(email: string): Promise<User> {
    try {
      return await this.userRepo.findOneOrFail({
        select: {
          id: true,
          email: true,
          role: true,
        },
        where: { email: email },
      });
    } catch (e) {
      throw new NotFoundException(`user with email: ${email} not found`);
    }
  }

  async getJwtAccessToken(userId: string) {
    const payload = { sub: userId };
    const accessToken = await this.jwt.signAsync(payload);
    return {
      accessToken,
    };
  }

  async getJwtEmailToken(email: string) {
    const payload = { email };
    const emailToken = await this.jwt.signAsync(payload);
    return {
      emailToken,
    };
  }

  public async getJwtRefreshToken(userId: string) {
    // const iatTimestamp = new Date();
    const tokenId = uuidv4();
    const payload = { sub: userId, tokenId };

    const refreshToken = await this.jwt.signAsync(
      payload,
      this.refreshKeysToken.refreshTokenPrivateKeyConfig(),
    );
    return {
      tokenId,
      refreshToken,
    };
  }

  async generateLoginTokens(user: User) {
    const [accessToken, refreshToken] = await Promise.all([
      this.getJwtAccessToken(user.id),
      this.getJwtRefreshToken(user.id),
    ]);

    const hashedRefreshToken = await this.hashData(refreshToken.refreshToken);
    //insertResult is database response object
    await this.postgresQueries.refreshTokenLoginTransaction(
      // this.dataSource,
      RefreshToken,
      hashedRefreshToken,
      user.id,
      refreshToken.tokenId,
    );

    return {
      accessToken: accessToken.accessToken,
      refreshToken: refreshToken.refreshToken,
    };
  }

  public async generateRefreshTokens(payload: RefreshTokenI) {
    const [accessToken, newRefreshToken] = await Promise.all([
      this.getJwtAccessToken(payload.sub),
      this.getJwtRefreshToken(payload.sub),
    ]);

    const hashedRefreshToken = await this.hashData(
      newRefreshToken.refreshToken,
    );

    await this.postgresQueries.refreshTokenTransaction(
      // this.dataSource,
      RefreshToken,
      hashedRefreshToken,
      payload,
      newRefreshToken.tokenId,
    );

    return {
      sub: payload.sub,
      accessToken: accessToken.accessToken,
      refreshToken: newRefreshToken.refreshToken,
    };
  }

  public async encodePassword(password: string): Promise<string> {
    const hashedPassword: string = await this.hashData(password);
    return hashedPassword;
  }

  public async isPasswordValid(
    password: string,
    userPassword: string,
  ): Promise<boolean> {
    const passwordValid = await this.verifyData(userPassword, password);
    return passwordValid;
  }

  public async getUserIfRefreshTokenMatches(
    refreshToken: string,
    payload: RefreshTokenI,
  ) {
    const foundToken = await this.tokenRepo
      .createQueryBuilder('refreshToken')
      .leftJoinAndSelect('refreshToken.user', 'user')
      .where('refreshToken.userId = :userId AND refreshToken.id = :id', {
        userId: payload.sub,
        id: payload.tokenId,
      })
      .select(['refreshToken.refreshToken'])
      .getOne();
    if (foundToken == null) {
      //refresh token is valid but is not in database
      //possible re-use!!! delete all refresh tokens(sessions) belonging to the sub
      await this.tokenRepo.delete({ user: payload.sub });
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    const isMatch = await this.verifyData(
      foundToken.refreshToken ?? '', //argon2 hashed
      refreshToken, //Base64Url encoded
    );
    const issuedAt = dayjs.unix(payload.iat);
    const diff = dayjs().diff(issuedAt, 'seconds');

    if (isMatch) {
      return await this.generateRefreshTokens(payload); //returns new tokens and inserts to db
    } else {
      //refresh token is valid and might have been used which makes it invalidated, and therefore not in the database anymore
      //can occur when a user runs multiple tabs of the front-end application in a browser or sometimes a lag
      // in a network and trying to use an already invalidated refresh token
      //less than 20s leeway mitigates this
      if (diff < 10 * 1 * 1) {
        console.log('leeway');
        return await this.generateRefreshTokens(payload);
      }

      //refresh token is valid but not in db
      // //possible re-use!!! delete all refresh tokens(sessions) belonging to the sub
      // if (payload.sub !== foundToken.user) {
      //   //the sub of the token isn't the id of the token in db
      //   // log out all session of this payalod id, reFreshToken has been compromised
      //   await this.tokenRepo.delete({ user: payload.sub });
      //   throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
      // }

      throw new HttpException('Something went wrong', HttpStatus.FORBIDDEN);
    }
  }
}
