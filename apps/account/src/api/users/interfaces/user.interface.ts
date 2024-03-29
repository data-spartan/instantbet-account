import { UserRolesEnum } from '../roles/roles.enum';

// export interface UserI {
//   id: number;
//   firstName: string;
//   lastName: string;
//   role: UserRolesEnum;
// }

export enum UserAgeEnum {
  AGE_MIN = 18,
  AGE_MAX = 150,
}

export enum CursorPaginationDirections {
  NEXT = 'Next',
  PREVIOUS = 'Previous',
}

export interface UserI {
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
