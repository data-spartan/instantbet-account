import { UserRolesEnum } from '../roles/roles.enum';

// export interface UserI {
//   id: number;
//   firstName: string;
//   lastName: string;
//   role: UserRolesEnum;
// }

export interface User {
  readonly id: string;

  readonly firstName: string;

  readonly lastName: string;

  readonly telephone: string;

  readonly email: string;

  readonly password: string;

  readonly role: UserRolesEnum;

  readonly verifiedEmail?: boolean | null;

  readonly verifyEmailToken?: string | null;

  readonly dateOfBirth: Date;

  readonly createdAt: string;

  readonly updatedAt: string;

  readonly lastLoginAt: string;
}
