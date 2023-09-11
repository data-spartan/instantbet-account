// this is default way of showing user resp to clients
import { Expose, Exclude } from 'class-transformer';
import { UserRolesEnum } from '../roles/roles.enum';
import { IsOptional } from 'class-validator';

export class UserDto {
  @Expose()
  @IsOptional()
  token: string;

  @Expose()
  public id: string;

  @Expose()
  public firstName: string;

  @Expose()
  public lastName: string;

  @Expose()
  public telephone: string;

  @Exclude()
  public password!: string;

  @Expose()
  public email!: string;

  @Expose()
  public verifiedEmail: boolean;

  @Expose()
  public role: UserRolesEnum;

  @Expose()
  public lastLoginAt: Date | null;

  @Expose()
  public createdAt: Date;

  @Expose()
  public updatedAt: Date;
}

// @Expose()
// export class UserDto {
//     public id: string;

//     public firstName: string;

//     public lastName: string;

//     public telephone: string;

//     @Exclude({ toPlainOnly: true })
//     public password!: string;

//     public email!: string;

//     public verifiedEmail: boolean;

//     public role: UserRolesEnum;

//     public lastLoginAt: Date | null;

//     public createdAt: Date;

//     public updatedAt: Date;
// }
