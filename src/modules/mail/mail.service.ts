import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import config from 'src/core/config';

@Injectable()
export class MailService {
  private logger = new Logger(MailService.name);
  constructor(private readonly _mailerService: MailerService) {}

  async sendTestEmail(email: string): Promise<boolean> {
    try {
      const res = await this._mailerService.sendMail({
        to: email,
        subject: 'Prueba de correo',
        template: './test',
      });
      this.logger.log(res);
      return true;
    } catch (err) {
      this.logger.error(err, 'Error al enviar correo');
      return false;
    }
  }

  async sendForgetPasswordEmail(
    email: string,
    token: string,
    fullName: string,
  ): Promise<boolean> {
    try {
      const res = await this._mailerService.sendMail({
        to: email,
        subject: 'Recuperar contraseña',
        template: './forget-password',
        context: {
          url: `${config().frontUrl}/auth/reset-password?token=${token}`,
          siteName: 'Yavirac',
          fullName,
        },
      });
      this.logger.log(res);
      return true;
    } catch (err) {
      this.logger.error(err);
      return false;
    }
  }
}
