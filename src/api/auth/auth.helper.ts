import {
  Injectable,
  HttpException,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import * as argon2 from 'argon2';
import { ITokenType } from './interfaces/token.interface';
import * as dayjs from 'dayjs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthHelper {
  constructor(
    @InjectRepository(User) private readonly repository: Repository<User>,
    private readonly jwt: JwtService,
    private readonly configService: ConfigService,
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
    return this.repository.findOne({
      select: { id: true, role: true, refreshToken: true },
      where: { id: decoded.sub },
    });
  }

  async getJwtAccessToken(userId: string) {
    const payload = { sub: userId };
    const accessToken = await this.jwt.signAsync(payload, {
      secret: this.configService.get('APP_JWT_SECRET'),
      expiresIn: '60s',
    });
    return {
      accessToken,
    };
  }

  public async getJwtRefreshToken(userId: string) {
    const payload = { sub: userId };
    const refreshToken = await this.jwt.signAsync(payload, {
      secret: this.configService.get('APP_JWT_REFRESH_SECRET'),
      expiresIn: '1d',
    });
    return {
      refreshToken,
    };
  }

  async handleLogin(user: User) {
    // const { refreshToken } = await this.getJwtRefreshToken(user.id);
    // const { accessToken } = await this.getJwtAccessToken(user.id);

    const [accessToken, refreshToken] = await Promise.all([
      this.getJwtAccessToken(user.id),
      this.getJwtRefreshToken(user.id),
    ]);
    try {
      const hash = await this.hashData(refreshToken.refreshToken);
      await this.repository.update(user.id, {
        refreshToken: hash,
        lastLoginAt: new Date(),
      });

      return {
        accessToken: accessToken.accessToken,
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

  public async generateTokens(payload: ITokenType) {
    const { accessToken } = await this.getJwtAccessToken(payload.sub);

    const { refreshToken: newRefreshToken } = await this.getJwtRefreshToken(
      payload.sub,
    );

    const hashedRefreshedToken = await this.hashData(newRefreshToken);
    this.repository.update(payload.sub, { refreshToken: hashedRefreshedToken });

    return {
      sub: payload.sub,
      accessToken,
      refreshToken: newRefreshToken,
      // accessTokenExpires: 10000, //getAccessExpiry(),
      // user: {
      //   id: payload.sub,
      // },
    };
  }

  // public generateToken(user: User): string {
  //   return this.jwt.sign({ sub: user.id });
  // }

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
    // tokenId: string,
    payload: ITokenType,
  ) {
    const user = await this.validateUser(payload);

    const isMatch = await this.verifyData(
      user.refreshToken ?? '',
      refreshToken,
    );

    const issuedAt = dayjs.unix(payload.iat);
    const diff = dayjs().diff(issuedAt, 'seconds');
    console.log(diff);
    if (user.refreshToken == null) {
      //refresh token is valid but the id is not in database
      //TODO:inform the user with the payload sub
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    if (isMatch) {
      return await this.generateTokens(payload);
    } else {
      //less than 30s leeway allows refresh for network concurrency
      if (diff < 30 * 1 * 1) {
        console.log('leeway');
        return await this.generateTokens(payload);
      }

      //refresh token is valid but not in db
      //possible re-use!!! delete all refresh tokens(sessions) belonging to the sub
      if (payload.sub !== user.id) {
        //the sub of the token isn't the id of the token in db
        // log out all session of this payalod id, reFreshToken has been compromised
        await this.repository.update(payload.sub, { refreshToken: '' });
        throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
      }

      throw new HttpException('Something went wrong', HttpStatus.BAD_REQUEST);
    }
  }
}
