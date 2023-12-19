import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { readFileSync } from '../helpers/readFile.helpers';
import { ConfigService } from '@nestjs/config';
import { AuthHelper } from '../auth.helper';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly configService: ConfigService,
    private readonly authHelper: AuthHelper,
  ) {
    super({
      ignoreExpiration: false,
      passReqToCallback: true,
      secretOrKey: readFileSync(
        configService.get<string>('JWT_PUBLIC_SECRET_ACCESS'),
      ).toString(),
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          const authCookie = req?.cookies['auth-cookie'];
          if (authCookie && authCookie.accessToken) {
            return req.cookies['auth-cookie'].accessToken;
          }
          return null;
        },
      ]),
    });
  }

  async validate(req: Request, payload: any) {
    if (!req.originalUrl.includes('password')) {
      const user = await this.authHelper.validateUser(payload);
    }
    const user = await this.authHelper.validateUser(payload, true);
    if (!user) throw new UnauthorizedException();
    //this validate method attaches user to Request object when return user
    return user;
  }
}
