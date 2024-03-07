import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import { NestExpressApplication } from '@nestjs/platform-express';
import { WinstonModule } from 'nest-winston';

import * as cookieParser from 'cookie-parser';
import { AccountModule } from './account.module';
import { loggerConfig } from '@app/common';

async function bootstrap() {
  const app: NestExpressApplication = await NestFactory.create(AccountModule, {
    logger: WinstonModule.createLogger({
      instance: loggerConfig('./apps/account'),
    }),
    cors: true,
  });
  const config: ConfigService = app.get(ConfigService);
  const port: number = config.get<number>('APP_PORT');
  const appName: string = config.get('APP_NAME');
  const apiPrefix: string = config.get('APP_API_PREFIX');

  app.setGlobalPrefix(apiPrefix);
  app.set('trust proxy', 1);
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' },
    }),
  );
  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      disableErrorMessages: false,
      transform: true,
      // transformOptions: {
      //   enableImplicitConversion: true, // This enables automatic type conversion
      // },
      whitelist: true,
    }),
  );
  await app.listen(port, () => {
    Logger.log(`${appName} is listening on port: ${port}`);
  });
}
bootstrap();
