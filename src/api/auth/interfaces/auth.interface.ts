import { UserRolesEnum } from 'src/api/users/roles/roles.enum';

export interface AuthedResponse {
  token: string;
  id?: string;
  // firstName: string;
  // lastName: string;
  // email: string;
  // lastLoginAt: Date;
  // role: UserRolesEnum;
}
