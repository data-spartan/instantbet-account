import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from '../../../entities/user.entity';
import { AuthHelper } from '../auth.helper';
import { Request } from 'express';
import { readFileSync } from '../helpers/readFile.helpers';
import { RedisCacheService } from 'src/shared/redisCache/redisCache.service';
import { RedisHashesEnum } from 'src/shared/redisCache/interfaces/redis.enum';

@Injectable()
export class ForgotPasswordStrategy extends PassportStrategy(
  Strategy,
  'jwt.forgot-password',
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

    const token = await this.redisService.hgetToken(
      user.id,
      RedisHashesEnum.FORGOT_PASSWORD_TOKEN,
    );

    if (!token) {
      throw new HttpException('Token expired', HttpStatus.NOT_FOUND);
    }

    const isMatch = token === emailToken;
    if (!isMatch)
      //it can happen that user clics on resend verifyemail even if link is not expired,
      // need to ensure that only last sent link is used
      throw new BadRequestException(
        'Reused some of the previous forgot password links',
      );

    return user;
  }
}
