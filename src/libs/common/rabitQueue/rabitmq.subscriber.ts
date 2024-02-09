// rabbit-mq/rabbit-mq.subscriber.ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import * as amqp from 'amqplib';

@Injectable()
export class RabbitMQSubscriber implements OnModuleInit {
  private readonly url = 'amqp://stef:123@localhost:5672';

  async onModuleInit(): Promise<void> {
    const connection = await amqp.connect(this.url);
    const channel = await connection.createChannel();
    const exchange = 'pubsub_exchange';
    await channel.assertExchange(exchange, 'direct', { durable: false });

    const queue = await channel.assertQueue('', { exclusive: true });

    const routingKey = 'pubsub_key';
    await channel.bindQueue(queue.queue, exchange, routingKey);

    // Consume messages from the queue
    channel.consume(
      queue.queue,
      (msg) => {
        if (msg) {
          const message = msg.content.toString();
          console.log(`Received message: ${message}`);
        }
      },
      { noAck: true },
    );
  }
}
