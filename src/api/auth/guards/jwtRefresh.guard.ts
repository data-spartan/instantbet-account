import {
  Injectable,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { User } from 'src/api/users/index.entity';
import { AuthGuard } from '@nestjs/passport';
import { jwtGuardException } from 'src/common/exceptions';

@Injectable()
export class JwtRefreshGuard extends AuthGuard('jwt-refresh-token') {
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
