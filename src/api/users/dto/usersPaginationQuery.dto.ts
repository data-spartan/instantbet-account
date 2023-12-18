import { PickType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsDateString,
  IsIn,
  IsInt,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  ValidateIf,
} from 'class-validator';
import { UUID } from 'crypto';
import { UsersPaginationDto } from './usersPagination.dto';
import { FindUsersQueryDto } from 'src/api/admin/dto/findUsersQuery.dto';
import { IntersectionType } from '@nestjs/mapped-types';

export class UsersPaginationQueryDto extends IntersectionType(
  UsersPaginationDto,
  FindUsersQueryDto,
) {}
