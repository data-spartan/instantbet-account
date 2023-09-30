import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { NestExpressApplication } from '@nestjs/platform-express';
import { LoggerMiddleware } from './common/middlewares/logging.middleware';

async function bootstrap() {
  const app: NestExpressApplication = await NestFactory.create(AppModule, {
    cors: true,
  });
  const config: ConfigService = app.get(ConfigService);
  const port: number = config.get<number>('APP_PORT');

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
  console.log(`[API] is running on: ${await app.getUrl()}`);
}
bootstrap();
