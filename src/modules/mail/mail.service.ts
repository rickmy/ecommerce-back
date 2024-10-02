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
        template: './forget-password',
        context: {
          url: 'https://www.google.com',
          siteName: 'Yavirac',
          email,
        },
      });
      this.logger.log(res);
      return true;
    } catch (err) {
      this.logger.error(err);
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

  async sendMailAgreementRenovation(
    coordinatorEmail: string,
    viceCoordinatorEmail: string,
    responsibleEmail: string,
    codes: string[],
  ): Promise<boolean> {
    try {
      const res = await this._mailerService.sendMail({
        to: [coordinatorEmail, viceCoordinatorEmail, responsibleEmail],
        subject: 'Alerta de convenios por vencer',
        template: './alert-agreements-to-expire',
        context: {
          siteName: 'Yavirac',
          
          codes,
        },
      });
      this.logger.log(res);
      return true;
    } catch (err) {
      this.logger.error(err);
      return false;
    }
  }

  async sendMailAgreementExpired(
    coordinatorEmail: string,
    viceCoordinatorEmail: string,
    responsibleEmail: string,
    code: string,
    company: string,
  ): Promise<boolean> {
    try {
      const res = await this._mailerService.sendMail({
        to: [coordinatorEmail, viceCoordinatorEmail, responsibleEmail],
        subject: 'Alerta del convenio por vencer',
        template: './alert-agreement-to-expire',
        context: {
          siteName: 'Yavirac',
          company,
          code,
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