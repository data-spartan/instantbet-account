import { SetMetadata } from '@nestjs/common';
import { UserRolesEnum } from 'src/api/users/roles/roles.enum';

export const ROLES_KEY = 'roles';
//setting alowed roles to Roles decorator in controller route
//e.g. @Roles(UserRolesEnum.Administrator)
export const Roles = (...roles: UserRolesEnum[]) =>
  SetMetadata(ROLES_KEY, roles);
