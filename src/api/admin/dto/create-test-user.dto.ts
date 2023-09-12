import { Trim } from 'class-sanitizer';
import {
  IsEmail,
  IsMobilePhone,
  IsString,
  MinLength,
  IsOptional,
  IsNotEmpty,
} from 'class-validator';
import { UserRolesEnum } from 'src/api/users/roles/roles.enum';

export class CreateTestUserDto {
  @Trim()
  @IsEmail()
  public readonly email: string;

  @IsString()
  @MinLength(8)
  public password: string;

  @IsString()
  public readonly firstName: string;

  @IsString()
  public readonly lastName: string;

  @IsMobilePhone('sr-RS')
  public readonly telephone: string;

  @IsNotEmpty() //must add decorator to be able to add default value
  public readonly role: UserRolesEnum = UserRolesEnum.Test;
}
