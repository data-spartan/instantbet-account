import { IsPasswordFormatValid } from '../validators';

export class ForgotPasswordDto {
  @IsPasswordFormatValid()
  public readonly newPassword: string;
}
