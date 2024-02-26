import { IsString, IsNotEmpty, IsEmail } from 'class-validator';

export class ConfirmEmailDto {
  @IsString()
  @IsNotEmpty()
  token: string;
}

export class VerifyEmailDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  emailToken: string;
}
