import { Controller } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { MailService } from './mail.service';
import { RmqService } from '@app/common';

@Controller()
export class MailController {
  constructor(
    private readonly mailService: MailService,
    private readonly rmqService: RmqService,
  ) {}

  @EventPattern('verification')
  //   @UseGuards(JwtAuthGuard)
  async sendVerificationEmail(
    @Payload() { email, emailToken }: any,
    @Ctx() context: RmqContext,
  ) {
    console.log(emailToken, email);
    await this.mailService.sendVerificationEmail(email, emailToken);
    this.rmqService.ack(context);
  }
}
