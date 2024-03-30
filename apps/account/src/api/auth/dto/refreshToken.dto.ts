import { IsNotEmpty, IsUUID } from 'class-validator';

export class RefreshTokenDto {
  @IsUUID()
  sub: string;

  @IsNotEmpty()
  access_token: string;

  @IsNotEmpty()
  refresh_token: string;
}
