import { Trim } from 'class-sanitizer';
import {
  IsEmail,
  IsMobilePhone,
  IsString,
  MinLength,
  IsOptional,
  IsDefined,
} from 'class-validator';
import { IsPasswordFormatValid } from '../validators';

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

  @IsMobilePhone('sr-RS')
  public readonly telephone!: string;
}
