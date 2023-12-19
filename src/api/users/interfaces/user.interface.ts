import { UserRolesEnum } from '../roles/roles.enum';

// export interface UserI {
//   id: number;
//   firstName: string;
//   lastName: string;
//   role: UserRolesEnum;
// }

export interface User {
  readonly id: string;

  firstName: string;

  lastName: string;

  telephone: string;

  email: string;

  password: string;

  role: UserRolesEnum;

  verifiedEmail?: boolean | null;

  verifyEmailToken?: string | null;

  readonly dateOfBirth: Date;

  readonly createdAt: string;

  readonly updatedAt: string;

  readonly lastLoginAt: string;
}
