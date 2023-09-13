// this is default way of showing user resp to clients
import { Expose, Exclude } from 'class-transformer';
import { UserRolesEnum } from '../roles/roles.enum';
import { IsOptional, IsString } from 'class-validator';

export class UserUpdateDto {
  @IsString()
  @IsOptional()
  public firstName: string;

  @IsString()
  @IsOptional()
  public lastName: string;

  @IsString()
  @IsOptional()
  public telephone: string;

  @IsString()
  @IsOptional()
  public email!: string;
}
