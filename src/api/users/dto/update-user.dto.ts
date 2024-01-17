// this is default way of showing user resp to clients
import { PartialType, PickType } from '@nestjs/mapped-types';
import { RegisterDto } from 'src/api/auth/dto';

export class UserUpdateDto extends PartialType(
  PickType(RegisterDto, ['firstName', 'lastName', 'telephone', 'email']),
) {}
