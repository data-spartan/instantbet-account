import { User } from 'libs/common/src/entities';
import { Injectable } from '@nestjs/common';
import { AuthGuard, IAuthGuard } from '@nestjs/passport';
import { jwtGuardException } from '@app/common';

@Injectable()
export class JwtRefreshGuard
  extends AuthGuard('jwt.refresh')
  implements IAuthGuard
{
  constructor() {
    super();
  }
  public handleRequest(err: any, user: User, info: any): any {
    //need to implement handleReq bcs want to catch jwt related errors without nest throwing generic forbiden
    if (!user) {
      jwtGuardException(err, info);
    }
    return user;
  }

  // public async canActivate(context: ExecutionContext): Promise<boolean> {
  //   //bcs you extended JwtAuthGuard you need to call canActivate of base AuthGuard
  //   // which then calls validate of auth.strategy to create request.user property
  //   // then you can extract user from req
  //   await super.canActivate(context);
  //   const { user }: Request = context.switchToHttp().getRequest();
  //   return user ? true : false;
  // }
}
