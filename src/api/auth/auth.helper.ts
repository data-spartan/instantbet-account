import {
  Injectable,
  HttpException,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import * as argon2 from 'argon2';
import { ITokenType } from './interfaces/token.interface';
import * as dayjs from 'dayjs';
import { ConfigService } from '@nestjs/config';
import { RefreshToken } from '../users/index.entity';
import { refreshTokenTransaction } from 'src/common/typeorm-queries';

@Injectable()
export class AuthHelper {
  // private connection;
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(RefreshToken)
    private readonly tokenRepo: Repository<RefreshToken>,
    private readonly jwt: JwtService,
    private readonly configService: ConfigService,
    private readonly dataSource: DataSource,
  ) {
    this.jwt = jwt;
    // this.connection = this.tokenRepo.manager.connection;
  }

  public async hashData(data: string) {
    return argon2.hash(data);
  }

  public async verifyData(data1: string, data2: string) {
    return argon2.verify(data1, data2);
  }

  public async validateUser(decoded: any): Promise<User> {
    return this.userRepo.findOne({
      select: { id: true, role: true },
      where: { id: decoded.sub },
    });
  }

  async getJwtAccessToken(userId: string) {
    const payload = { sub: userId };
    const accessToken = await this.jwt.signAsync(payload, {
      secret: this.configService.get('APP_JWT_SECRET'),
      expiresIn: this.configService.get('APP_JWT_EXPIRES'),
    });
    return {
      accessToken,
    };
  }

  public async getJwtRefreshToken(userId: string) {
    const payload = { sub: userId };
    const refreshToken = await this.jwt.signAsync(payload, {
      secret: this.configService.get('APP_JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get('APP_REFRESH_JWT_EXPIRES'),
    });
    return {
      refreshToken,
    };
  }

  async handleLogin(user: User) {
    const [accessToken, refreshToken] = await Promise.all([
      this.getJwtAccessToken(user.id),
      this.getJwtRefreshToken(user.id),
    ]);
    try {
      const hashedRefreshToken = await this.hashData(refreshToken.refreshToken);

      const insertResult = await refreshTokenTransaction(
        this.dataSource,
        RefreshToken,
        hashedRefreshToken,
        { user: user.id },
        user.id,
      );

      return {
        accessToken: accessToken.accessToken,
        tokenId: insertResult.identifiers[0].id,
        refreshToken: refreshToken.refreshToken,
        // tokenId: token.id,
        // accessTokenExpires: getAccessExpiry(),
        // user: {
        //   id: user.id,
        // },
      };
    } catch (error) {
      throw new Error(`${error.message}`);
    }
  }

  public async generateTokens(payload: ITokenType, tokenId: string) {
    const [accessToken, newRefreshToken] = await Promise.all([
      this.getJwtAccessToken(payload.sub),
      this.getJwtRefreshToken(payload.sub),
    ]);

    const hashedRefreshToken = await this.hashData(
      newRefreshToken.refreshToken,
    );

    const insertResult = await refreshTokenTransaction(
      this.dataSource,
      RefreshToken,
      hashedRefreshToken,
      { id: tokenId },
      payload.sub,
    );

    return {
      sub: payload.sub,
      accessToken: accessToken.accessToken,
      tokenId: insertResult.identifiers[0].id,
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
    tokenId: string,
    payload: ITokenType,
  ) {
    const foundToken = await this.tokenRepo.findOne({ where: { id: tokenId } });

    const isMatch = await this.verifyData(
      foundToken.refreshToken ?? '',
      refreshToken,
    );
    const issuedAt = dayjs.unix(payload.iat);
    const diff = dayjs().diff(issuedAt, 'seconds');
    if (foundToken == null) {
      //refresh token is valid but the id is not in database
      //TODO:inform the user with the payload sub
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    if (isMatch) {
      return await this.generateTokens(payload, tokenId);
    } else {
      //less than 20s leeway allows refresh for network concurrency
      if (diff < 20 * 1 * 1) {
        console.log('leeway');
        return await this.generateTokens(payload, tokenId);
      }

      //refresh token is valid but not in db
      // //possible re-use!!! delete all refresh tokens(sessions) belonging to the sub
      // if (payload.sub !== foundToken.user) {
      //   //the sub of the token isn't the id of the token in db
      //   // log out all session of this payalod id, reFreshToken has been compromised
      //   await this.tokenRepo.delete({ user: payload.sub });
      //   throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
      // }

      throw new HttpException('Something went wrong', HttpStatus.BAD_REQUEST);
    }
  }
}
