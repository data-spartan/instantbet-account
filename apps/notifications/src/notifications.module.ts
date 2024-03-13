import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MailModule } from './mailer/mail.module';
import { APP_FILTER } from '@nestjs/core';
import { ExceptionFilterRpc } from '@app/common';
import * as Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationOptions: Joi.object({
        NODE_ENV: Joi.string().required(),

        RABBIT_MQ_URI: Joi.string().required(),
        RABIT_PORT: Joi.number().required(),
        RABBITMQ_DEFAULT_USER: Joi.string().required(),
        RABBITMQ_DEFAULT_PASSWORD: Joi.string().required(),
        RABBIT_MQ_EMAIL_QUEUE: Joi.string().required(),

        S3_KEY: Joi.string().required(),
        S3_SECRET: Joi.string().required(),
        S3_ENDPOINT: Joi.string().required(),
        S3_REGION: Joi.string().required(),
        S3_BUCKET_NAME: Joi.string().required(),
        S3_BUCKET_URL: Joi.string().required(),
      }),
      isGlobal: true,
      /*
      using this.config.get can read proces.env.VAR or .env file if specified
      dockerized app doesnt read direclty from .env. We pass .env content in docker-compose file
       and config.get is reading var as proces.env behind the scenes
       */
      ignoreEnvFile: process.env.NODE_ENV === 'production' ? true : false,
      envFilePath: '.env',
    }),
    MailModule,
  ],
  providers: [
    Logger,
    {
      provide: APP_FILTER,
      useClass: ExceptionFilterRpc,
    },
  ],
})
export class NotificationsModule {
  // cant use midleware for microservices, use interceptor for logging
  // configure(consumer: MiddlewareConsumer): void {
  //   consumer.apply(LoggerMiddlewareRpc).forRoutes('*');
  // }
}
