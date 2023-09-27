import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { ITokenType } from '../interfaces/token.interface';
import { AuthService } from '../auth.service';
import { AuthHelper } from '../auth.helper';

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
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('APP_JWT_REFRESH_SECRET'),
      passReqToCallback: true,
    });
  }

  async validate(request: Request, payload: ITokenType) {
    //payload -> decoded sent refresh token
    const refreshToken = request.header('Authorization').split(' ')[1];
    // const tokenId = request.header('Token-Id');
    // console.log(refreshToken);
    return this.authHelper.getUserIfRefreshTokenMatches(
      refreshToken,
      // tokenId,
      payload,
    );
  }
}
