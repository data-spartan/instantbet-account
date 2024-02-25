import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailerConfigService } from './config/mailer.config';
import { MailSender } from './mailSender.service';
import { MailController } from './mail.controller';
import { ConfigModule } from '@nestjs/config';
import { RmqModule } from '@app/common';

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
    MailerModule.forRootAsync({
      useClass: MailerConfigService,
    }),
    RmqModule,
  ],
  controllers: [MailController],
  providers: [MailService, MailSender],
  exports: [MailService],
})
export class MailModule {}
