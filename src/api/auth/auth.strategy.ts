import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from '../users/entities/user.entity';
import { AuthHelper } from './auth.helper';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly helper: AuthHelper,
    private readonly config: ConfigService,
  ) {
    super({
      usernameField: 'email',
      secretOrKey: config.get('APP_JWT_KEY'),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
    });
  }
  async validate(payload: any): Promise<User> | never {
    //after canActivate in authGuard returns true it trigger jwtstrategy to verify token signature
    //if true, then proceeds to validate
    //payload is token decoded object
    const user = await this.helper.validateUser(payload);
    // console.log('IN JWTSTRATEGY VALIDATE');
    if (!user) throw new UnauthorizedException();
    //this validate method attaches user to Request object when return user
    return user;
  }
}
