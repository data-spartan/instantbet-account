import {
  ValidationOptions,
  registerDecorator,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { ChangePasswordDto } from '@account/api/users/dto';
import { InvalidPasswordFormatException, passwordRegex } from '@app/common';

const exceptionInvalidPasswordFormat = (label: string) =>
  `${label} must contain at least 8 characters (max 12), one uppercase letter, one lowercase letter, one digit, and one special character (@$!%*?&)`;

@ValidatorConstraint({ async: true })
export class IsPasswordFormatValidConstraint
  implements ValidatorConstraintInterface
{
  // private currentPassword: string;
  // private newPassword: string;
  validate(
    value: any,
    validationArguments?: ValidationArguments,
  ): boolean | Promise<boolean> {
    const { newPassword, currentPassword } =
      validationArguments.object as ChangePasswordDto;
    // this.newPassword = newPassword;
    // this.currentPassword = currentPassword;
    //at least one lowercase letter, one uppercase letter, one digit, and one special character, lenght 8-12
    const IsFormatValid = passwordRegex.test(value);
    //in register its only importnatn if password have valid format
    // if (validationArguments.targetName === 'RegisterDto') {
    //   return IsFormatValid;
    // }
    // if (validationArguments.targetName === 'ChangePasswordDto') {
    //   return IsFormatValid;
    // }
    // if (validationArguments.targetName === 'ForgotPasswordDto') {
    //   return IsFormatValid;
    // }
    return IsFormatValid;
  }

  defaultMessage(args: ValidationArguments): string {
    if (args.targetName === 'ChangePasswordDto') {
      throw new InvalidPasswordFormatException(
        exceptionInvalidPasswordFormat(args.property),
      );
    }
    //this relates to RegisterDto invalid format
    throw new InvalidPasswordFormatException(
      exceptionInvalidPasswordFormat(args.property),
    );
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
