import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MailModule } from './mailer/mail.module';

@Module({
  imports: [
    ConfigModule.forRoot({
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
})
export class NotificationsModule {}
