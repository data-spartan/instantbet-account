import { IsNotEmpty, IsUUID } from 'class-validator';

export class RefreshTokenDto {
  @IsUUID()
  sub: string;

  @IsNotEmpty()
  accessToken: string;

  @IsNotEmpty()
  refreshToken: string;
}
