import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { UUID } from 'crypto';
import { CursorPaginationDirections } from '../interfaces/user.interface';

export class UsersPaginationDto {
  @IsString()
  public cursor: Date;

  @IsOptional()
  @IsUUID()
  public userId: UUID | null;

  @Type(() => Number)
  @IsNumber()
  public limit: number;

  @IsEnum(CursorPaginationDirections)
  public direction: CursorPaginationDirections;
}
