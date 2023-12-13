import { Trim } from 'class-sanitizer';
import {
  IsEmail,
  IsMobilePhone,
  IsString,
  MinLength,
  IsOptional,
  IsDefined,
  IsNumber,
  Min,
  Max,
  IsNotEmpty,
} from 'class-validator';
import { IsPasswordFormatValid } from '../validators';
import { UserEnum } from 'src/api/users/entities/user.enum';

export class RegisterDto {
  @Trim()
  @IsEmail()
  public readonly email!: string;

  @IsString()
  @IsPasswordFormatValid()
  public readonly password!: string;

  @IsDefined()
  @IsString()
  public readonly firstName: string;

  @IsDefined()
  @IsString()
  public readonly lastName: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(UserEnum.AGE_MIN, {
    message: `Must be greater than ${UserEnum.AGE_MIN}`,
  })
  @Max(UserEnum.AGE_MAX, {
    message: `Must be smaller than ${UserEnum.AGE_MAX}`,
  })
  public readonly age: number;

  @IsMobilePhone('sr-RS')
  public readonly telephone!: string;
}
