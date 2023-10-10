import {
  ValidationOptions,
  registerDecorator,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { ChangePasswordDto } from 'src/api/users/dto';
import {
  exceptionInvalidPasswordFormat,
  // exceptionNewRepeatPasswordsNoMatch,
} from '../exceptions';
import { passwordRegex } from 'src/constants';
import { InvalidPasswordFormatException } from '../exceptions/invalidPasswordFormat.exception';

@ValidatorConstraint({ async: true })
export class IsPasswordFormatValidConstraint
  implements ValidatorConstraintInterface
{
  private currentPassword: string;
  private newPassword: string;
  validate(
    value: any,
    validationArguments?: ValidationArguments,
  ): boolean | Promise<boolean> {
    const { newPassword, currentPassword } =
      validationArguments.object as ChangePasswordDto;
    this.newPassword = newPassword;
    this.currentPassword = currentPassword;
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
