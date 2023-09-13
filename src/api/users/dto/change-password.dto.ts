import { IsDefined, IsString, MinLength } from 'class-validator';
import { IsPasswordFormatValid } from 'src/common/validators/password-format.validator';

export class ChangePasswordDto {
  @IsString()
  @IsDefined()
  public readonly currentPassword: string;

  @IsString()
  @IsDefined()
  @MinLength(8)
  public readonly newPassword: string;

  @IsString()
  @IsDefined()
  // @Match(ChangePasswordDto, (cppd) => cppd.newPassword)
  @IsPasswordFormatValid()
  public readonly repeatNewPassword: string;
}
