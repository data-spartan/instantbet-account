import { Trim } from 'class-sanitizer';
import { IsDefined, IsEmail } from 'class-validator';

export class ForgotPasswordEmailDto {
  @Trim()
  @IsEmail()
  @IsDefined()
  public readonly email: string;
}
