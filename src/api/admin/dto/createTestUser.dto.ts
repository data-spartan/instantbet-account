import { IsNotEmpty } from 'class-validator';
import { RegisterDto } from 'src/api/auth/dto';
import { IsPasswordFormatValid } from 'src/api/auth/validators';
import { UserRolesEnum } from 'src/api/users/roles/roles.enum';

export class CreateTestUserDto extends RegisterDto {
  @IsPasswordFormatValid()
  public password!: string;

  @IsNotEmpty() //must add decorator to be able to add default value
  public readonly role: UserRolesEnum = UserRolesEnum.Test;
}
