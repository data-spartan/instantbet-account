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

export class UsersPaginationDto {
  @IsString()
  cursor: Date;

  @IsOptional()
  @IsUUID()
  userId: UUID | null;

  @Type(() => Number)
  @IsNumber()
  limit: number;

  @IsIn(['Next', 'Previous'])
  direction: 'Next' | 'Previous';
}
