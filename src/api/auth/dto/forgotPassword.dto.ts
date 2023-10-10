import { IsDefined, IsString, MinLength } from 'class-validator';
import { IsPasswordFormatValid } from 'src/common/validators';

export class ForgotPasswordDto {
  @IsPasswordFormatValid()
  public readonly newPassword: string;
}
