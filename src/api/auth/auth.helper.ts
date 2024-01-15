import {
  Injectable,
  HttpException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import * as argon2 from 'argon2';
import { ITokenType } from './interfaces/token.interface';
import * as dayjs from 'dayjs';
import { ConfigService } from '@nestjs/config';
import { RefreshToken } from '../users/index.entity';
import { RefreshPrivateSecretService } from './refreshKeysLoad.service';
import { PostgresTypeOrmQueries } from 'src/database/postgres/queries/postgresTypeorm.query';

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

  public async validateUser(
    decoded: any,
    getPassword: boolean = false,
  ): Promise<User> {
    return this.userRepo.findOne({
      select: {
        id: true,
        email: true,
        verifyEmailToken: true,
        role: true,
        verifiedEmail: true,
        password: getPassword,
      },
      where: { id: decoded.sub },
    });
  }

  public async confirmEmail(email: string, invalidateToken: null) {
    return this.userRepo.update(
      { email },
      {
        verifiedEmail: true,
        verifyEmailToken: invalidateToken,
      },
    );
  }

  public async validateUserByEmail(email: string): Promise<User> {
    try {
      return await this.userRepo.findOneOrFail({
        select: {
          id: true,
          email: true,
          verifyEmailToken: true,
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
    const payload = { sub: userId };
    const refreshToken = await this.jwt.signAsync(
      payload,
      this.refreshKeysToken.refreshTokenPrivateKeyConfig(),
    );
    return {
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
    await this.postgresQueries.refreshTokenTransaction(
      // this.dataSource,
      RefreshToken,
      hashedRefreshToken,
      user.id,
    );

    return {
      accessToken: accessToken.accessToken,
      refreshToken: refreshToken.refreshToken,
    };
  }

  public async generateRefreshTokens(payload: ITokenType) {
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
      payload.sub,
    );

    return {
      sub: payload.sub,
      accessToken: accessToken.accessToken,
      refreshToken: newRefreshToken.refreshToken,
      // accessTokenExpires: 10000, //getAccessExpiry(),
      // user: {
      //   id: payload.sub,
      // },
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
    payload: ITokenType,
  ) {
    const foundToken = await this.tokenRepo
      .createQueryBuilder('refreshToken')
      .leftJoinAndSelect('refreshToken.user', 'user')
      .where('refreshToken.userId = :userId', { userId: payload.sub })
      .select(['refreshToken.refreshToken'])
      .getOne();
    if (foundToken == null) {
      //refresh token(sent in Auth header from FE) is valid but is not in database
      //TODO:inform the user with the payload sub
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
      if (diff < 20 * 1 * 1) {
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
