import {
  Injectable,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AuthGuard, IAuthGuard } from '@nestjs/passport';
import { User } from 'src/api/users/entities/user.entity';
import { Request } from 'express';
import { jwtGuardException } from 'src/common/exceptions';

@Injectable() //when req comes to guard, it call accessToken strategy
export class EmailJwtAuthGuard
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
    if (!user) {
      jwtGuardException(err, info);
    }
    return user;
  }
}
