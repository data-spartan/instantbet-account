import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailSender } from './mailSender.service';
import { EmailTemplatesEnum } from './enums';
import {
  ChangePasswordEmailContext,
  VerificationEmailContext,
} from './interfaces';

@Injectable()
export class MailService {
  constructor(
    private readonly mailSender: MailSender,
    private readonly configService: ConfigService,
  ) {}

  private getAppUrl() {
    return this.configService.get<boolean>('APP_IN_PRODUCTION')
      ? `${this.configService.get<boolean>('DOMAIN')}`
      : `${this.configService.get<boolean>(
          'APP_DEV_DOMAIN',
        )}:${this.configService.get<boolean>('APP_DEV_FRONTEND_PORT')}`;
  }

  private generateVerificationLink(token: string) {
    return `https:///verify-email/${token}`;
  }

  private generateChangePasswordLink(token: string) {
    return `${this.getAppUrl()}/change-password/${token}`;
  }

  public async sendVerificationEmail(
    to: string,
    firstName: string,
    lastName: string,
    token: string,
  ) {
    const verifyLink = this.generateVerificationLink(token);
    await this.mailSender.sendEmail<VerificationEmailContext>({
      to,
      subject: 'Verify E-mail Address @ InstantBet',
      template: EmailTemplatesEnum.VerificationEmail,
      context: {
        firstName,
        lastName,
        verifyLink,
      },
    });
  }

  public async sendChangePasswordEmail(
    to: string,
    firstName: string,
    lastName: string,
    token: string,
  ) {
    const changePasswordLink = this.generateChangePasswordLink(token);
    await this.mailSender.sendEmail<ChangePasswordEmailContext>({
      to,
      subject: 'Change Your Password @ InstantBet',
      template: EmailTemplatesEnum.VerificationEmail,
      context: {
        firstName,
        lastName,
        changePasswordLink,
      },
    });
  }
}
