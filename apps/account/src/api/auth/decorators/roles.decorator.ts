import { UserRolesEnum } from '@account/api/users/roles/roles.enum';
import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';
//setting alowed roles to Roles decorator in controller route
//e.g. @Roles(UserRolesEnum.Administrator)
export const Roles = (...roles: UserRolesEnum[]) =>
  SetMetadata(ROLES_KEY, roles);
