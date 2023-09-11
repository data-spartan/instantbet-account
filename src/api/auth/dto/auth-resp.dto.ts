// this is default way of showing user resp to clients
import { Expose, Exclude } from 'class-transformer';
import { UserRolesEnum } from 'src/api/users/roles/roles.enum';

export class AuthRespDto {
  @Expose()
  token: string;

  @Expose()
  public firstName: string;

  @Expose()
  public lastName: string;

  @Expose()
  public email!: string;

  @Expose()
  public role: UserRolesEnum;

  @Expose()
  public lastLoginAt: Date | null;
}
