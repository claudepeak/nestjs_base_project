import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { SendMailDto as SendMailDto } from './dto/send-mail.dto';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  ///
  async sendEmail(sendMailDto: SendMailDto): Promise<any> {
    const { email, subject, context, template } = sendMailDto;

    return await this.mailerService
      .sendMail({
        to: email,
        from: process.env.EMAIL_ADRESS,
        subject: subject,
        context: context,
        template: template,
      })
      .then((success) => {
        return { message: 'Email send', success: true };
      })
      .catch((error) => {
        console.log(error);
        return { message: 'Email not send', success: false };
      });
  }
}
