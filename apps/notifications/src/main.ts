import { NestFactory } from '@nestjs/core';
import { RmqService } from '@app/common';
import { MailModule } from './mailer/mail.module';

async function bootstrap() {
  // this way you are creating consumer
  const app = await NestFactory.create(MailModule);
  const rmqService = app.get<RmqService>(RmqService);
  app.connectMicroservice(rmqService.getOptions('EMAIL'));
  await app.startAllMicroservices();
  await app.listen(3001);
}
bootstrap();
