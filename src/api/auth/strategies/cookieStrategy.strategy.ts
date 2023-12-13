import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { readFileSync } from '../helpers/readFile.helpers';
import { ConfigService } from '@nestjs/config';
import { AuthHelper } from '../auth.helper';

@Injectable()
export class CookieJwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly configService: ConfigService,
    private readonly authHelper: AuthHelper,
  ) {
    super({
      ignoreExpiration: false,
      secretOrKey: readFileSync(
        configService.get<string>('JWT_PUBLIC_SECRET_ACCESS'),
      ).toString(),
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          let data = request?.cookies['auth-cookie'];
          if (!data) {
            return null;
          }
          return data.accessToken;
        },
      ]),
    });
  }

  async validate(payload: any) {
    const user = await this.authHelper.validateUser(payload);
    if (!user) throw new UnauthorizedException();
    //this validate method attaches user to Request object when return user
    return user;
  }
}
