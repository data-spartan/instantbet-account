import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { ClassConstructor } from 'class-transformer';

export const Match = <T>(
  type: ClassConstructor<T>,
  property: (o: T) => any,
  validationOptions?: ValidationOptions,
) => {
  return (object: any, propertyName: string) => {
    console.log(object, propertyName, type, property, 'IN MATCH DECORATOR');
    //PROPERTY NAME: repeatNewPasswor,type: ChangePasswordDto,
    //property: anonymus func (cppd) => cppd.newPassword
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [property],
      validator: MatchConstraint,
    });
  };
};

@ValidatorConstraint({ name: 'Match' })
export class MatchConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    // console.log(value, args);
    const [fn] = args.constraints; //anonym func which is returned from Match decorator
    return fn(args.object) === value; //value RepeatnewPassword, args.obj: newPassword
  }

  defaultMessage(args: ValidationArguments) {
    const [constraintProperty]: Array<() => any> = args.constraints;
    return `${(constraintProperty + '').split('.')[1]} and ${
      args.property
    } do not match.`;
  }
}
