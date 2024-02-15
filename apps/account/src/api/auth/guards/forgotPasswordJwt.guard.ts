import { User } from 'libs/common/src/entities';
import { Injectable } from '@nestjs/common';
import { AuthGuard, IAuthGuard } from '@nestjs/passport';
import { jwtGuardException } from '@account/exception-filters/exceptions';

@Injectable() //when req comes to guard, it call accessToken strategy
export class ForgotPasswordJwtAuthGuard
  extends AuthGuard('jwt.forgot-password')
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
}
