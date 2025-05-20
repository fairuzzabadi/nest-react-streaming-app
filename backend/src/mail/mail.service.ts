import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor(configService: ConfigService) {
    this.transporter = nodemailer.createTransport(
      {
        host: configService.get('MAILER_HOST'),
        secure: true,
        auth: {
          user: configService.get('MAILER_USER'),
          pass: configService.get('MAILER_PASSWORD'),
        },
      },
      {
        from: `Streamly ${configService.get('MAILER_USER')}`,
      },
    );
  }

  async sendMail(mailOptions: nodemailer.SendMailOptions) {
    return this.transporter.sendMail(mailOptions);
  }
}
