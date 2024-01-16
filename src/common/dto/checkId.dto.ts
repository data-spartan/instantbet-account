import { IsUUID } from 'class-validator';

export class CheckIdDto {
  @IsUUID()
  id: string;
}
