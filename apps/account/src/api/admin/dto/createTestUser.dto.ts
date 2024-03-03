import { IsNotEmpty } from 'class-validator';
import { RegisterDto } from '../../auth/dto';
import { IsPasswordFormatValid } from '../../auth/validators';
import { UserRolesEnum } from '../../users/roles/roles.enum';

export class CreateTestUserDto extends RegisterDto {
  @IsPasswordFormatValid()
  public password!: string;

  @IsNotEmpty() //must add decorator to be able to add default value
  public readonly role: UserRolesEnum = UserRolesEnum.Test;
}
