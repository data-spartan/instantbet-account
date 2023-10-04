import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { ITokenType } from '../interfaces/token.interface';
import { AuthService } from '../auth.service';
import { AuthHelper } from '../auth.helper';
import * as fs from 'fs';
@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh-token',
) {
  constructor(
    private readonly configService: ConfigService,
    private authHelper: AuthHelper,
  ) {
    super({
      secretOrKey: fs
        .readFileSync(configService.get<string>('JWT_PUBLIC_SECRET_REFRESH'))
        .toString(),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
    });
  }

  async validate(request: Request, payload: ITokenType) {
    //payload -> decoded sent refresh token
    const refreshToken = request.header('Authorization').split(' ')[1];
    const tokenId = request.header('Token-Id');
    const user = await this.authHelper.getUserIfRefreshTokenMatches(
      refreshToken,
      tokenId,
      payload,
    );
    const cookie = `Refresh=${
      user.refreshToken
    }; HttpOnly; Path=/; Max-Age=${this.configService.get(
      'JWT_REFRESH_TOKEN_EXPIRATION_TIME',
    )}`;
    request.res.set({
      'Token-Id': user.tokenId,
      'Set-Cookie': [{ cookie, refreshToken: user.refreshToken }],
    });

    return user;
  }
}
