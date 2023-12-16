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
import { IsDateOfBirth, IsPasswordFormatValid } from '../validators';
import { UserAgeEnum } from 'src/api/users/entities/user.enum';

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
  @IsDateOfBirth()
  public readonly dateOfBirth: Date;

  @IsMobilePhone('sr-RS')
  public readonly telephone!: string;
}
