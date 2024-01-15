import { Type } from 'class-transformer';
import { IsIn, IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';
import { UUID } from 'crypto';

export class UsersPaginationDto {
  @IsString()
  public cursor: Date;

  @IsOptional()
  @IsUUID()
  public userId: UUID | null;

  @Type(() => Number)
  @IsNumber()
  public limit: number;

  @IsIn(['Next', 'Previous'])
  public direction: 'Next' | 'Previous';
}
