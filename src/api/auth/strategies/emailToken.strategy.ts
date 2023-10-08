import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from '../../users/entities/user.entity';
import { AuthHelper } from '../auth.helper';
import * as fs from 'fs';
import { UsersService } from 'src/api/users/users.service';

@Injectable()
export class EmailTokenStrategy extends PassportStrategy(
  Strategy,
  'passport-local',
) {
  constructor(
    private readonly authHelper: AuthHelper,
    private readonly config: ConfigService,
  ) {
    super({
      usernameField: 'email',
      secretOrKey: fs
        .readFileSync(config.get<string>('JWT_PUBLIC_SECRET_ACCESS'))
        .toString(),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
    });
  }

  async validate(payload: any): Promise<User> | never {
    const user = await this.authHelper.validateUserByEmail(payload.email);
    if (user.verifiedEmail)
      throw new BadRequestException('Email already confirmed');
    this.authHelper.confirmEmail(user.email);
    return user;
  }
}
