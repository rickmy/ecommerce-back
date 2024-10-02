import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import config from 'src/core/config';
import { MailService } from './mail.service';
import { join } from 'path';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: () => ({
        transport: {
          host: config().mailHost,
          port: +config().mailPort,
          secure: false,
          auth: {
            user: config().mailUser,
            pass: config().mailPassword,
          },
        },
        defaults: {
          from: `"Yavirac" <${config().mailFrom}>`,
        },
        template: {
          dir: join(__dirname, 'templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
