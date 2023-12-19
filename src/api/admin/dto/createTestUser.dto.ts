import { OmitType, PickType } from '@nestjs/mapped-types';
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
import { extend } from 'dayjs';
import { RegisterDto } from 'src/api/auth/dto';
import { IsDateOfBirth, IsPasswordFormatValid } from 'src/api/auth/validators';
import { UserAgeEnum } from 'src/api/users/entities/user.enum';
import { UserRolesEnum } from 'src/api/users/roles/roles.enum';

export class CreateTestUserDto extends RegisterDto {
  @IsPasswordFormatValid()
  public password!: string;

  @IsNotEmpty() //must add decorator to be able to add default value
  public readonly role: UserRolesEnum = UserRolesEnum.Test;
}
