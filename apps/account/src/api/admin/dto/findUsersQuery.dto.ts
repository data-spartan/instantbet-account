import { RegisterDto } from '@account/api/auth/dto';
import { PartialType, PickType } from '@nestjs/mapped-types';

export class FindUsersQueryDto extends PartialType(
  PickType(RegisterDto, ['firstName', 'lastName']),
) {}
