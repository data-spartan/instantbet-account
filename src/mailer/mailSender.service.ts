import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
// import { SendEmail } from './mail.interface'

@Injectable()
export class MailSender {
  constructor(private readonly mailerService: MailerService) {}

  public async sendEmail<T>({ to, subject, template, context }) {
    try {
      console.log({
        to,
        subject,
        template,
        context,
      });
      await this.mailerService.sendMail({
        to,
        subject,
        template,
        context,
      });
    } catch (e) {
      console.warn('Error while sending email', e);
    }
  }
}
