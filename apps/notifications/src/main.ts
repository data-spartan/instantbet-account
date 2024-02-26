import { NestFactory } from '@nestjs/core';
import { RabitMqEnum, RmqService } from '@app/common';
import { NotificationsModule } from './notifications.module';

async function bootstrap() {
  // this way you are creating consumer
  const app = await NestFactory.create(NotificationsModule);
  const rmqService = app.get<RmqService>(RmqService);
  app.connectMicroservice(rmqService.getOptions(RabitMqEnum.EMAIL));
  await app.startAllMicroservices();
  await app.listen(3001);
}
bootstrap();
