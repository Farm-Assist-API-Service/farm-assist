import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { EProviderStatus } from 'src/appointment/enums/provider-status.enum';
import { EmailEngineFactory } from './factory';
import { EmailEngines } from '../enums/email-engines.enum';
import { IFailedOauthTokenMail } from '../interfaces/email.interfaces';

@Injectable()
export class EmailService {
  private provider: EmailEngines;
  constructor(private readonly emailService: EmailEngineFactory) {
    this.provider = EmailEngines.NODE_MAILER;
  }
  @OnEvent(EProviderStatus.TOKEN_ERROR)
  async sendFailedTokenGenerationMail({
    subject,
    ...inputs
  }: IFailedOauthTokenMail) {
    await this.emailService
      .findOne(this.provider)
      .sendFailedTokenGenerationMail({
        ...inputs,
        subject: `[SERVER_ERR] ${inputs.provider} Oauth Token Error`,
      });
  }
}
