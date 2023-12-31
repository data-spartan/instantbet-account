import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRolesEnum } from 'src/api/users/roles/roles.enum';
import { AuthHelper } from 'src/api/auth/auth.helper';
import { Observable } from 'rxjs';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly helper: AuthHelper,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // console.log('IN ROLESGUARD CANACTIVATE');
    //getting allowed roles to controller
    const requiredRoles = this.reflector.getAllAndOverride<UserRolesEnum[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) {
      //if route doesnt need AuthZ, i.e. isnt decorated with Roles decorator
      //just allow
      return true;
    }
    const { user } = context.switchToHttp().getRequest();

    return requiredRoles.some((role) => user.role?.includes(role));
  }
}
