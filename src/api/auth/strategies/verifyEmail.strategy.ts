import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthHelper } from '../auth.helper';
import { Request } from 'express';
import { readFileSync } from '../helpers/readFile.helpers';
import { RedisCacheService, RedisHashesEnum } from '@app/common';
import { User } from '@app/common/entities';

@Injectable()
export class VerifyEmailStrategy extends PassportStrategy(
  Strategy,
  'jwt.verify-email',
) {
  constructor(
    private readonly authHelper: AuthHelper,
    private readonly redisService: RedisCacheService,
    private readonly configService: ConfigService,
  ) {
    super({
      usernameField: 'email',
      secretOrKey: readFileSync(
        configService.get<string>('JWT_PUBLIC_SECRET_ACCESS'),
      ).toString(),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      passReqToCallback: true,
    });
  }

  async validate(request: Request, payload: any): Promise<User> | never {
    const emailToken = request.header('Authorization').split(' ')[1];
    const user = await this.authHelper.validateUserByEmail(payload.email);
    if (!user) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
    if (user.verifiedEmail)
      throw new BadRequestException('Email already confirmed');
    const token = await this.redisService.hgetToken(
      user.id,
      RedisHashesEnum.VERIFY_EMAIL_TOKEN,
    );

    if (!token) {
      throw new HttpException('Token expired', HttpStatus.NOT_FOUND);
    }

    const isMatch = token === emailToken;
    if (!isMatch)
      //it can happen that user clics on resend verifyemail even if link is not expired,
      // need to ensure that only last sent link is used
      throw new BadRequestException(
        'Reused some of the previous confirmation links',
      );

    return user;
  }
}
