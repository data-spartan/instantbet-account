// this is default way of showing user resp to clients
import { Expose, Exclude } from 'class-transformer';
import { UserRolesEnum } from '../roles/roles.enum';
import { IsOptional, IsString } from 'class-validator';

export class UserUpdateDto {
  //crucial not to include password valdiation, bcs only in change-password could change passwd
  @IsOptional()
  @IsString()
  public firstName: string;

  @IsOptional()
  @IsString()
  public lastName: string;

  @IsOptional()
  @IsString()
  public telephone: string;

  @IsOptional()
  @IsString()
  public email: string;
}
