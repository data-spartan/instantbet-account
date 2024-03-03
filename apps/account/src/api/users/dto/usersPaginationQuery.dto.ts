import { FindUsersQueryDto } from '@account/api/admin/dto/findUsersQuery.dto';
import { UsersPaginationDto } from './usersPagination.dto';
import { IntersectionType } from '@nestjs/mapped-types';

export class UsersPaginationQueryDto extends IntersectionType(
  UsersPaginationDto,
  FindUsersQueryDto,
) {}
