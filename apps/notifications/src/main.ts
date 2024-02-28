import { NestFactory } from '@nestjs/core';
import { RabitMqEnum, RmqService, loggerConfig } from '@app/common';
import { NotificationsModule } from './notifications.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { WinstonModule } from 'nest-winston';

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

  const rmqService = app.get<RmqService>(RmqService);
  app.connectMicroservice(rmqService.getOptions(RabitMqEnum.EMAIL));
  await app.startAllMicroservices();
  await app.listen(3001);
}
bootstrap();
