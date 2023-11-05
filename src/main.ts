import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { NestExpressApplication } from '@nestjs/platform-express';
import { WinstonModule } from 'nest-winston';
import { instance } from './common/logger/logger.app';

async function bootstrap() {
  const app: NestExpressApplication = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger({
      instance: instance,
    }),
    cors: true,
  });
  console.log(instance);
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

  await app.listen(port, () => {
    instance.info(`App is listening on port: ${port}`);
  });
}
bootstrap();
