// src/validators/is-date-string.validator.ts
import { ValidateBy, ValidationOptions, isDateString } from 'class-validator';
import { UserAgeEnum } from 'src/api/users/interfaces/user.interface';

export function IsDateOfBirth(
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  let message;
  return ValidateBy(
    {
      name: 'IsDateOfBirth',
      validator: {
        validate: (value: unknown): boolean => {
          if (!isDateString(value)) {
            message = 'Invalid date format. Use YYYY-MM-DD';
            return false;
          }
          const today = new Date();
          const birthDate = new Date(value as string);
          let age = today.getFullYear() - birthDate.getFullYear();
          const m = today.getMonth() - birthDate.getMonth();
          if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
          }
          if (age < UserAgeEnum.AGE_MIN) {
            message = 'User must be 18 years or older';
            return false;
          }
          return true;
        },
        defaultMessage: () => message,
      },
    },
    validationOptions,
  );
}
