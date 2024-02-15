import { IsPasswordFormatValid } from '@account/api/auth/validators';

export class ChangePasswordDto {
  @IsPasswordFormatValid()
  public readonly currentPassword: string;

  @IsPasswordFormatValid()
  public readonly newPassword: string;
}
