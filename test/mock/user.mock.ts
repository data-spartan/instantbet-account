import { User } from 'src/api/users/interfaces/user.interface';
import { UserRolesEnum } from 'src/api/users/roles/roles.enum';

export class UserMock {
  public authUser(): Omit<
    User,
    'emailVerified' | 'id' | 'createdAt' | 'updatedAt' | 'lastLoginAt'
  > {
    return {
      firstName: 'Stefan',
      lastName: 'Mili',
      email: 'stefan@test.com',
      password: '1!Aa45678',
      telephone: '0642298381',
      dateOfBirth: new Date('1993-03-23'),
      role: UserRolesEnum.Basic,
    };
  }
}
// export const USER_MOCK: Omit<
//   User,
//   'emailVerified' | 'id' | 'createdAt' | 'updatedAt' | 'lastLoginAt'
// > = {
//   firstName: 'Stefan',
//   lastName: 'Mili',
//   email: 'stefan@test.com',
//   password: '1!Aa45678',
//   telephone: '0642298381',
//   dateOfBirth: new Date('1993-03-23'),
//   role: UserRolesEnum.Basic,
// };
