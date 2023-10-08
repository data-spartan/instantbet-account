import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailerConfigService } from './config/mailer.config';
import { MailSender } from './mailSender.service';
import { AuthHelper } from 'src/api/auth/auth.helper';
import { AuthModule } from 'src/api/auth/auth.module';

@Module({
  imports: [
    MailerModule.forRootAsync({
      useClass: MailerConfigService,
    }),
  ],
  providers: [MailService, MailSender],
  exports: [MailService],
})
export class MailModule {}
