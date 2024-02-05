import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { UserContext } from 'src/common/interfaces';

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
