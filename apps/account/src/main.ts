import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { NestExpressApplication } from '@nestjs/platform-express';
import { WinstonModule } from 'nest-winston';

import * as cookieParser from 'cookie-parser';
import { instance } from './logger/loggerApp.config';

async function bootstrap() {
  const app: NestExpressApplication = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger({
      instance: instance,
    }),
    cors: true,
  });

  const config: ConfigService = app.get(ConfigService);
  const port: number = config.get<number>('APP_PORT');
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
  await app.listen(port);
}
bootstrap();
