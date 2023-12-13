import { Trim } from 'class-sanitizer';
import {
  IsEmail,
  IsMobilePhone,
  IsString,
  MinLength,
  IsOptional,
  IsNotEmpty,
  IsNumber,
  Min,
  Max,
} from 'class-validator';
import { UserEnum } from 'src/api/users/entities/user.enum';
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

  @IsNotEmpty()
  @IsNumber()
  @Min(UserEnum.AGE_MIN, {
    message: `Must be greater than ${UserEnum.AGE_MIN}`,
  })
  @Max(UserEnum.AGE_MAX, {
    message: `Must be smaller than ${UserEnum.AGE_MAX}`,
  })
  public readonly age: number;
}
