import { IsDefined, IsString, MinLength } from 'class-validator';
import { Match } from 'src/common/validators';

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
  @Match(ChangePasswordDto, (cppd) => cppd.newPassword)
  public readonly repeatNewPassword: string;
}
