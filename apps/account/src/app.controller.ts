import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { RabbitMQPublisher } from 'libs/common/src';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly rabbitMQPublisher: RabbitMQPublisher,
  ) {}

  @Get()
  async getHello(): Promise<string> {
    const message = 'Hello RabbitMQ!';

    const pubsubMessage = 'A hopping-good time!';
    this.rabbitMQPublisher.publishMessage(
      'pubsub_exchange',
      'pubsub_key',
      pubsubMessage,
    );

    return message;
  }
}
