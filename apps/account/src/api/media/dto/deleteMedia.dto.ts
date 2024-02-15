import { IsArray } from 'class-validator';

export class DeleteMediaDto {
  @IsArray()
  deleteFiles: string[];
}
