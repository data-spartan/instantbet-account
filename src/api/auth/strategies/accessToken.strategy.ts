import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from '../../users/entities/user.entity';
import { AuthHelper } from '../auth.helper';
import * as fs from 'fs';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly helper: AuthHelper,
    private readonly config: ConfigService,
  ) {
    super({
      usernameField: 'sub',
      // secretOrKey: config.get('APP_JWT_SECRET'),
      secretOrKey: fs
        .readFileSync(config.get<string>('JWT_PUBLIC_SECRET_ACCESS'))
        .toString(),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
    });
  }

  async validate(payload: any): Promise<User> | never {
    //after canActivate in authGuard returns true it trigger jwtstrategy to verify token signature
    //if true, then proceeds to validate
    //payload is token decoded object
    const user = await this.helper.validateUser(payload);
    if (!user) throw new UnauthorizedException();
    //this validate method attaches user to Request object when return user
    return user;
  }
}
