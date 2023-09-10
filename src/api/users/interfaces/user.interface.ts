import { UserRolesEnum } from '../roles/roles.enum';

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  role: UserRolesEnum;
}
