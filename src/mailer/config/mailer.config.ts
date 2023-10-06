import { MailerOptions, MailerOptionsFactory } from '@nestjs-modules/mailer';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';
import { MailerConfigEnum } from './mailer.config.enum';

@Injectable()
export class MailerConfigService implements MailerOptionsFactory {
  private readonly config: ConfigService;

  onModuleInit() {
    console.warn(`### Mailer Service Module ###`);
    console.warn(`Mailer Module Initiated.`);
    console.warn(`### Mailer Service Module END ###`);
  }

  createMailerOptions(): MailerOptions | Promise<MailerOptions> {
    return {
      transport: {
        host: this.config.get<string>(MailerConfigEnum.MAIL_HOST),
        port: this.config.get<number>(MailerConfigEnum.MAIL_PORT),
        //secure: true, // true for 465, false for other ports
        auth: {
          user: this.config.get<string>(MailerConfigEnum.MAIL_USERNAME), // generated ethereal user
          pass: this.config.get<string>(MailerConfigEnum.MAIL_PASSWORD), // generated ethereal password
        },
      },
      preview: true,
      defaults: {
        from: `"No Reply" <${this.config.get<string>(
          MailerConfigEnum.NO_REPLY_EMAIL,
        )}>`,
      },
      template: {
        dir: join(__dirname, 'templates'),
        adapter: new HandlebarsAdapter(undefined, {
          inlineCssEnabled: true,
          /** See https://www.npmjs.com/package/inline-css#api */
          inlineCssOptions: {
            url: ' ',
            preserveMediaQueries: true,
          },
        }),
        options: {
          strict: true,
        },
      },
      options: {
        partials: {
          dir: join(__dirname, 'templates/partials'),
          options: {
            strict: true,
          },
        },
      },
    };
  }
}
