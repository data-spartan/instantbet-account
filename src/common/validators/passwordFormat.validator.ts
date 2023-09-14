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
  exceptionNewRepeatPasswordsNoMatch,
} from '../exceptions';
import { passwordRegex } from 'src/constants';
import { InvalidPasswordFormatException } from '../exceptions/invalidPasswordFormat.exception';

@ValidatorConstraint({ async: true })
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
    //at least one lowercase letter, one uppercase letter, one digit, and one special character, lenght 8-12
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
        // throw new BadRequestException(
        //   exceptionInvalidPasswordFormat(args.property),
        // );
        throw new InvalidPasswordFormatException(
          exceptionInvalidPasswordFormat(args.property),
        );
      }
      // return exceptionNewRepeatPasswordsNoMatch(args.property);
      throw new InvalidPasswordFormatException(
        exceptionNewRepeatPasswordsNoMatch(args.property),
      );
    }
    //this relates to RegisterDto invalid format
    // return exceptionInvalidPasswordFormat(args.property);
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
