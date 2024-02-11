import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthHelper } from '../auth.helper';
import { User } from '@app/common/entities';

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
