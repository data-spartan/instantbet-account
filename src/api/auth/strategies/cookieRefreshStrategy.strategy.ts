import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { readFileSync } from '../helpers/readFile.helpers';
import { ConfigService } from '@nestjs/config';
import { AuthHelper } from '../auth.helper';

@Injectable()
export class CookieRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt.refresh',
) {
  constructor(
    private readonly configService: ConfigService,
    private readonly authHelper: AuthHelper,
  ) {
    super({
      ignoreExpiration: false,
      passReqToCallback: true,
      secretOrKey: readFileSync(
        configService.get<string>('JWT_PUBLIC_SECRET_REFRESH'),
      ).toString(),
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          let data = request?.cookies['auth-cookie'];
          if (!data) {
            return null;
          }
          return data.refreshToken;
        },
      ]),
    });
  }

  async validate(req: Request, payload: any) {
    const data = req?.cookies['auth-cookie'];

    if (!data?.refreshToken) {
      throw new BadRequestException('invalid refresh token');
    }
    const user = await this.authHelper.getUserIfRefreshTokenMatches(
      data.refreshToken,
      payload,
    );
    if (!user) throw new UnauthorizedException();
    //this validate method attaches user to Request object when return user
    return user;
  }
}
