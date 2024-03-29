import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';

@Injectable()
export class RefreshPrivateSecretService {
  refreshJwtOptions: any;
  constructor(private readonly configService: ConfigService) {
    this.refreshJwtOptions = {
      privateKey: fs
        .readFileSync(
          this.configService.get<string>('JWT_PRIVATE_SECRET_REFRESH'),
        )
        .toString(),
      expiresIn: this.configService.get('APP_REFRESH_JWT_EXPIRES'),
    };
  }
  public refreshTokenPrivateKeyConfig() {
    return this.refreshJwtOptions;
  }
}
