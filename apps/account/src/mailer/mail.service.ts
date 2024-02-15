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
    return process.env.NODE_ENV === 'production'
      ? `${this.configService.get<boolean>(
          'APP_PRODUCTION_DOMAIN',
        )}:${this.configService.get<boolean>('APP_PRODUCTION_FRONTEND_PORT')}`
      : `${this.configService.get<boolean>(
          'APP_DEV_DOMAIN',
        )}:${this.configService.get<boolean>('APP_DEV_FRONTEND_PORT')}`;
  }

  private generateVerificationLink(token: string) {
    return `${this.getAppUrl()}/verify-email/${token}`;
  }

  private generateForgotPasswordLink(token: string) {
    return `${this.getAppUrl()}/change-password/${token}`;
  }

  public async sendVerificationEmail(email: string, emailToken: string) {
    // const { emailToken } = await this.authHelper.getJwtEmailToken(email);
    const verifyLink = this.generateVerificationLink(emailToken);
    await this.mailSender.sendEmail<VerificationEmailContext>({
      to: email,
      subject: 'Verify E-mail Address @ InstantBet',
      template: EmailTemplatesEnum.VerificationEmail,
      context: {
        email,
        verifyLink,
      },
    });
  }

  public async sendForgotPasswordEmail(email: string, emailToken: string) {
    const changePasswordLink = this.generateForgotPasswordLink(emailToken);
    await this.mailSender.sendEmail<ChangePasswordEmailContext>({
      to: email,
      subject: 'Change Your Password @ InstantBet',
      template: EmailTemplatesEnum.ForgotPasswordEmail,
      context: {
        email,
        changePasswordLink,
      },
    });
  }
}
