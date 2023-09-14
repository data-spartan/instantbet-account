import { IsDefined, IsString, MinLength } from 'class-validator';
import { IsPasswordFormatValid } from 'src/common/validators';

export class ChangePasswordDto {
  @IsDefined()
  @IsString()
  public readonly currentPassword: string;

  @IsDefined()
  @IsString()
  public readonly newPassword: string;

  @IsDefined()
  @IsString()
  @IsPasswordFormatValid()
  public readonly repeatNewPassword: string;
}
