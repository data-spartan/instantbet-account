import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard, IAuthGuard } from '@nestjs/passport';
import { User } from 'src/api/users/entities/user.entity';
import { Request } from 'express';
import { Observable } from 'rxjs';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') implements IAuthGuard {
  constructor() {
    super();
  }
  public handleRequest(err: any, user: User): any {
    //dont need to implement this if dont want to manipulate with user object
    //ofc it has impact only on writing operations, bcs in read oeprations
    // user object gets overwriten
    // console.log('IN HANDLE REQUEST');
    return user;
  }

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    // console.log('IN AUTH GUARD');
    //bcs you extended JwtAuthGuard you need to call canActivate of base AuthGuard
    // which then calls validate of auth.strategy to create request.user property
    // then you can extract user from req
    await super.canActivate(context);
    // console.log('AFTER BASE CANACTIVATE');
    const { user }: Request = context.switchToHttp().getRequest();
    return user ? true : false;
  }
}
