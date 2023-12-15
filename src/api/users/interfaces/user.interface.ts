import { UserRolesEnum } from '../roles/roles.enum';

export interface UserI {
  id: number;
  firstName: string;
  lastName: string;
  role: UserRolesEnum;
}
