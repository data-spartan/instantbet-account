import { Trim } from 'class-sanitizer';
import { IsDefined, IsEmail } from 'class-validator';

export class ForgotPasswordEmailDto {
  @IsDefined()
  @Trim()
  @IsEmail()
  public readonly email: string;
}
