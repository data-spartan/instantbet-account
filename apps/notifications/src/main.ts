import { NestFactory } from '@nestjs/core';
import { RabitMqEnum, RmqService, loggerConfig } from '@app/common';
import { NotificationsModule } from './notifications.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { WinstonModule } from 'nest-winston';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  // this way you are creating consumer
  // const app = await NestFactory.create(NotificationsModule);
  const app: NestExpressApplication = await NestFactory.create(
    NotificationsModule,
    {
      logger: WinstonModule.createLogger({
        instance: loggerConfig('./apps/notifications'),
      }),
      cors: true,
    },
  );
  const config: ConfigService = app.get(ConfigService);
  const port: number = Number(config.get<number>('NOTIFICATIONS_PORT'));
  const rmqService = app.get<RmqService>(RmqService);
  app.connectMicroservice(rmqService.getOptions(RabitMqEnum.EMAIL), {
    inheritAppConfig: true,
  });

  await app.startAllMicroservices();
  await app.listen(port);
}
bootstrap();
