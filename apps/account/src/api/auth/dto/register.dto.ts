import { Trim } from 'class-sanitizer';
import {
  IsEmail,
  IsMobilePhone,
  IsString,
  IsDefined,
  IsNotEmpty,
} from 'class-validator';
import { IsDateOfBirth, IsPasswordFormatValid } from '../validators';
import { PrivateFile, RefreshToken, User } from '@app/common/entities';

interface RegisterUserDto
  extends Omit<
    User,
    | 'id'
    | 'verifyEmailToken'
    | 'verifiedEmail'
    | 'role'
    | 'createdAt'
    | 'updatedAt'
    | 'lastLoginAt'
  > {}

export class RegisterDto implements RegisterUserDto {
  public avatar?: string;
  public files: PrivateFile[];
  public refreshToken?: RefreshToken;
  @IsDefined()
  @Trim()
  @IsEmail()
  public readonly email!: string;

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
