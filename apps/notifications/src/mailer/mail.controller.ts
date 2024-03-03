import { Controller } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { MailService } from './mail.service';
import { RmqService } from '@app/common';
import { VerifyEmailDto } from './dto/email.dto';

@Controller()
export class MailController {
  constructor(
    private readonly mailService: MailService,
    private readonly rmqService: RmqService,
  ) {}

  @EventPattern('verification')
  async sendVerificationEmail(
    @Payload() { email, emailToken }: VerifyEmailDto,
    @Ctx() context: RmqContext,
  ) {
    await this.mailService.sendVerificationEmail(email, emailToken);
    this.rmqService.ack(context);
  }

  @EventPattern('forgot_password')
  async sendForgotPasswordEmail(
    @Payload() { email, emailToken }: VerifyEmailDto,
    @Ctx() context: RmqContext,
  ) {
    await this.mailService.sendForgotPasswordEmail(email, emailToken);
    this.rmqService.ack(context);
  }
}
