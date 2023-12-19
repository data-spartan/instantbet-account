import { PartialType, PickType } from '@nestjs/mapped-types';
import { RegisterDto } from 'src/api/auth/dto';

export class FindUsersQueryDto extends PartialType(
  PickType(RegisterDto, ['firstName', 'lastName']),
) {}
