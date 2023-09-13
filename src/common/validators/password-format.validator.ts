// password-validation.decorator.ts

import {
  ValidationOptions,
  registerDecorator,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { ChangePasswordDto } from 'src/api/users/dto';

@ValidatorConstraint()
export class IsPasswordFormatValidConstraint
  implements ValidatorConstraintInterface
{
  private newPassword: string;
  private repeatNewPassword: string;
  validate(
    value: any,
    validationArguments?: ValidationArguments,
  ): boolean | Promise<boolean> {
    const { newPassword, repeatNewPassword } =
      validationArguments.object as ChangePasswordDto;
    this.newPassword = newPassword;
    this.repeatNewPassword = repeatNewPassword;
    // least one lowercase letter, one uppercase letter, one digit, and one special character, lenght 8-12
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,12}$/;

    const IsFormatValid = passwordRegex.test(value);
    //in register its only importnatn if password have valid format
    if (validationArguments.targetName === 'RegisterDto') {
      return IsFormatValid;
    }
    //chanignig password need to check if repeatedpassword has valid format
    if (validationArguments.targetName === 'ChangePasswordDto') {
      return IsFormatValid && this.newPassword === this.repeatNewPassword;
    }
  }

  defaultMessage(args: ValidationArguments): string {
    if (args.targetName === 'ChangePasswordDto') {
      if (this.newPassword === this.repeatNewPassword) {
        //if these 2 are same, problem is with pass format, othervise problem is with their equality
        return `${args.property} must contain at least 8 characters (max 12), one uppercase letter, one lowercase letter, one digit, and one special character (@$!%*?&)`;
      }
      return `newPassword and ${args.property} do not match.`;
    }
    //this relates to RegisterDto invalid format
    return `${args.property} must contain at least 8 characters (max 12), one uppercase letter, one lowercase letter, one digit, and one special character (@$!%*?&)`;
  }
}

export function IsPasswordFormatValid(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsPasswordFormatValidConstraint,
    });
  };
}
