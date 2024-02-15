// rabbit-mq/rabbit-mq.module.ts

import { Module } from '@nestjs/common';
// import { RabbitMQClient } from './rabbit-mq.client';
// import { RabbitMQServer } from './rabbit-mq.server';
import { RabbitMQPublisher } from './rabitmq.publisher';
import { RabbitMQSubscriber } from './rabitmq.subscriber';

@Module({
  providers: [RabbitMQPublisher, RabbitMQSubscriber],
  exports: [RabbitMQPublisher, RabbitMQSubscriber],
})
export class RabbitMQModule {}
