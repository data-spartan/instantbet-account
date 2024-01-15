import { Injectable, ExecutionContext } from '@nestjs/common';
import { User } from 'src/api/users/index.entity';
import { AuthGuard, IAuthGuard } from '@nestjs/passport';
import { jwtGuardException } from 'src/exception-filters/exceptions';

@Injectable()
export class JwtRefreshGuard
  extends AuthGuard('jwt.refresh')
  implements IAuthGuard
{
  constructor() {
    super();
  }
  public handleRequest(
    err: any,
    user: User,
    info: any,
    context: ExecutionContext,
    status?: any,
  ): any {
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
