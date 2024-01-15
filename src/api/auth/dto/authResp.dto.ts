// this is default way of showing user resp to clients
import { Expose } from 'class-transformer';
import { UserRolesEnum } from 'src/api/users/roles/roles.enum';

//if using dto in serialize interceptor need to define Expose/Exclude on all properties
//for excludeExtraneousValues: true in serialiazer to able to correctly include/exclude resp propertires
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
