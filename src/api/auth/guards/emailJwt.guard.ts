import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard, IAuthGuard } from '@nestjs/passport';
import { User } from 'src/api/users/entities/user.entity';
import { jwtGuardException } from 'src/exception-filters/exceptions';

@Injectable() //when req comes to guard, it call accessToken strategy
export class VerifyEmailAuthGuard
  extends AuthGuard('jwt.verify-email')
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
    //e.g. if email token is expired it will return appropriate error to FE which will need to trigger
    // 'resend-confirmation-link'(nofity user to send again verif email)
    if (!user) {
      jwtGuardException(err, info);
    }
    return user;
  }
}
