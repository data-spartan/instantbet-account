import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { Request } from 'express';
import { UsersService } from 'src/api/users/users.service';
import { AuthHelper } from '../auth.helper';
import { User } from 'src/api/users/index.entity';

@Injectable()
export class LoginVerifiedGuard implements CanActivate {
  constructor(private readonly authHelper: AuthHelper) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    let user: User;
    const { body, ...request } = context.switchToHttp().getRequest();
    try {
      user = await this.authHelper.validateUserByEmail(body.email);
      request.user = user;
    } catch (e) {
      throw new UnauthorizedException('User token is invalid.');
    }
    return user.verifiedEmail || false;
  }
}
