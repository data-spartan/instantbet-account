import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailerConfigService } from './config/mailer.config';
import { MailSender } from './mailSender.service';
import { MailController } from './mail.controller';
import { RmqModule } from '@app/common';

@Module({
  imports: [
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
