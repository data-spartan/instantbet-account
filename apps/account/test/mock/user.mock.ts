import { UserRolesEnum } from '@account/api/users/roles/roles.enum';
import { User } from '@app/common/entities';

export class UserMock {
  public authUser(): Omit<
    User,
    'verifiedEmail' | 'id' | 'createdAt' | 'updatedAt' | 'lastLoginAt' | 'files'
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
