import { MailerOptions, MailerOptionsFactory } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';
import { MailerConfigEnum } from '../enums/mailerConfig.enum';

@Injectable()
export class MailerConfigService implements MailerOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  onModuleInit() {}

  createMailerOptions(): MailerOptions | Promise<MailerOptions> {
    return {
      transport: {
        service: 'Gmail',
        // host: this.config.get<string>(MailerConfigEnum.EMAIL_HOST),
        // port: this.config.get<number>(MailerConfigEnum.EMAIL_PORT),
        //secure: true, // true for 465, false for other ports
        auth: {
          user: this.configService.get<string>(MailerConfigEnum.EMAIL_USERNAME), // generated ethereal user
          pass: this.configService.get<string>(MailerConfigEnum.EMAIL_PASSWORD), // generated ethereal password
        },
      },
      preview: true,
      defaults: {
        from: `"No Reply" <${this.configService.get<string>(
          MailerConfigEnum.NO_REPLY_EMAIL,
        )}>`,
      },
      template: {
        //need to match with nestcli asset conf bcs dirname is /dist/apps/account
        dir: join(__dirname, '../../mailer/templates'),
        adapter: new HandlebarsAdapter(), //{
        // inlineCssEnabled: true,
        /** See https://www.npmjs.com/package/inline-css#api */
        // inlineCssOptions: {
        //   url: ' ',
        //   preserveMediaQueries: true,
        // },
        // }),
        options: {
          strict: true,
        },
      },
      // options: {
      //   partials: {
      //     dir: join(__dirname, 'templates/partials'),
      //     options: {
      //       strict: true,
      //     },
      //   },
      // },
    };
  }
}
