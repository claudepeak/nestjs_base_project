import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { MailService } from './mail.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SendMailDto } from './dto/send-mail.dto';
import { AdminOnly } from 'src/app/middlewares/user-exist.guard';

@Controller('mail')
@ApiTags('Mail')
@ApiBearerAuth()
export class MailController {
  constructor(private readonly mailerService: MailService) {}

  /*  @Post('send-email')
  @UseGuards(AdminOnly)
  @ApiOperation({ summary: 'Send email via email service' })
  sendEmail(@Body() sendEmailDto: SendMailDto) {
    return this.mailerService.sendEmail(sendEmailDto);
  }*/
}
