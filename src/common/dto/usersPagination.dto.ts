import { Type } from 'class-transformer';
import {
  IsDate,
  IsDateString,
  IsIn,
  IsInt,
  IsNumber,
  IsNumberString,
  IsString,
  IsUUID,
  Matches,
} from 'class-validator';
import { UUID } from 'crypto';

export class UsersPaginationDto {
  @IsString()
  timestamp: Date;

  @Type(() => Number)
  @IsNumber()
  limit: number;

  @IsUUID()
  cursor: UUID;

  @IsIn(['Next', 'Previous'])
  direction: 'Next' | 'Previous';
}
