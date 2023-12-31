import { IsDefined, IsString, MinLength } from 'class-validator';
import { IsPasswordFormatValid } from 'src/api/auth/validators';

export class ChangePasswordDto {
  @IsPasswordFormatValid()
  public readonly currentPassword: string;

  @IsPasswordFormatValid()
  public readonly newPassword: string;
}
