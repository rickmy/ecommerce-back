import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import {
  MAIL_FROM,
  MAIL_HOST,
  MAIL_PASSWORD,
  MAIL_PORT,
  MAIL_USER,
} from 'src/core/config';
import { MailService } from './mail.service';
import { join } from 'path';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: () => ({
        transport: {
          host: MAIL_HOST,
          port: +MAIL_PORT,
          auth: {
            user: MAIL_USER,
            pass: MAIL_PASSWORD,
          },
        },
        defaults: {
          from: `"Ecommerce" <${MAIL_FROM}>`,
        },
        template: {
          dir: join(__dirname, '../../../modules/mail/templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
