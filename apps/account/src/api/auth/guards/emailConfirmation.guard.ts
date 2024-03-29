import { UserContext } from 'libs/common/src';
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class EmailConfirmationGuard implements CanActivate {
  // decorators resolve from bottom to top,
  // you need first jwtauthguard to populate request object with user
  canActivate(context: ExecutionContext) {
    const request: UserContext = context.switchToHttp().getRequest();

    if (!request.user?.verifiedEmail) {
      throw new UnauthorizedException('Confirm your email first');
    }

    return true;
  }
}
