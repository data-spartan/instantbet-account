import { MailerService } from '@nestjs-modules/mailer';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
// import { SendEmail } from './mail.interface'

@Injectable()
export class MailSender {
  constructor(private readonly mailerService: MailerService) {}
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async sendEmail<T>({ to, subject, template, context }) {
    try {
      await this.mailerService.sendMail({
        to,
        subject,
        template,
        context,
      });
    } catch (e) {
      throw new HttpException(
        'Error while sending email',
        HttpStatus.BAD_REQUEST,
        { cause: e.stack },
      );
    }
  }
}
