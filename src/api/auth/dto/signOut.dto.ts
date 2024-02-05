import { Type } from 'class-transformer';
import { IsUUID, ValidateNested } from 'class-validator';

export class SignOutIdsDto {
  @IsUUID()
  public tokenId: string;

  @IsUUID()
  userId: string;
}

export class SignOutDto {
  @ValidateNested({ each: true })
  @Type(() => SignOutIdsDto)
  user: SignOutIdsDto;
}
