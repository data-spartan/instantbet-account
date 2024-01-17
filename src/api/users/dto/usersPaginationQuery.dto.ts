import { UsersPaginationDto } from './usersPagination.dto';
import { FindUsersQueryDto } from 'src/api/admin/dto/findUsersQuery.dto';
import { IntersectionType } from '@nestjs/mapped-types';

export class UsersPaginationQueryDto extends IntersectionType(
  UsersPaginationDto,
  FindUsersQueryDto,
) {}
