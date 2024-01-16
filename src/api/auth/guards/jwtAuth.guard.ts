import { Injectable } from '@nestjs/common';
import { AuthGuard, IAuthGuard } from '@nestjs/passport';
import { User } from 'src/api/users/entities/user.entity';
import { jwtGuardException } from 'src/exception-filters/exceptions';

@Injectable() //when req comes to guard,first goes through canAcivate
//,then it calls accessToken strategy
export class JwtAuthGuard extends AuthGuard('jwt') implements IAuthGuard {
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
  // //only if want to add extra logic to canActivate need to call super.canactivate
  // public async canActivate(context: ExecutionContext): Promise<boolean> {
  //   //bcs you extended JwtAuthGuard you need to call canActivate of base AuthGuard
  //   // which then calls validate of auth.strategy to create request.user property
  //   // then you can extract user from req
  //   await super.canActivate(context);
  //   const { user }: Request = context.switchToHttp().getRequest();
  //   return user ? true : false;
  // }
}
