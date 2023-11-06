import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { NestExpressApplication } from '@nestjs/platform-express';
import { WinstonModule } from 'nest-winston';
import { LoggerService } from './logger/logger.service';
// import { instance } from './logger/logger.app';

async function bootstrap() {
  const app: NestExpressApplication = await NestFactory.create(AppModule, {
    logger: new LoggerService(),
    cors: true,
  });
  const config: ConfigService = app.get(ConfigService);
  const port: number = config.get<number>('APP_PORT');
  // app.useLogger(instance);
  app.set('trust proxy', 1);
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' },
    }),
  );
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
