import { Provider } from '@nestjs/common';
import { S3 } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';

export enum S3Enum {
  S3_PROVIDER = 'S3_PROVIDER',
}

export const S3Provider: Provider = {
  provide: S3Enum.S3_PROVIDER,
  useFactory: (configService: ConfigService) => {
    return new S3({
      endpoint: configService.get('S3_ENDPOINT'),
      region: configService.get('S3_REGION'),
      credentials: {
        accessKeyId: configService.get('S3_KEY'),
        secretAccessKey: configService.get('S3_SECRET'),
      },
      maxAttempts: 5,
    });
  },
  inject: [ConfigService],
};
