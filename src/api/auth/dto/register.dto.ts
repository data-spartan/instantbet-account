import { Trim } from 'class-sanitizer';
import {
  IsEmail,
  IsMobilePhone,
  IsString,
  MinLength,
  IsOptional,
} from 'class-validator';
import { IsPasswordFormatValid } from 'src/common/validators/password-format.validator';

export class RegisterDto {
  @Trim()
  @IsEmail()
  public readonly email: string;

  @IsString()
  @IsPasswordFormatValid()
  public readonly password: string;

  @IsString()
  public readonly firstName: string;

  @IsString()
  public readonly lastName: string;

  @IsOptional()
  @IsMobilePhone('sr-RS')
  public readonly telephone: string;
}
