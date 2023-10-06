import { Module } from '@nestjs/common';
import { MailService } from './mailSender.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailerConfigService } from './config/mailer.config';

@Module({
  imports: [
    MailerModule.forRootAsync({
      useClass: MailerConfigService,
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
