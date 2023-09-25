import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { EProviderStatus } from 'src/appointment/enums/provider-status.enum';
import { EmailEngineFactory } from './factory';
import { EmailEngines } from '../enums/email-engines.enum';
import { IFailedOauthTokenMail } from '../interfaces/email.interfaces';
import { AppointmentEvents } from 'src/core/enums/events/appointment.events';
import { IJoinAppointment } from 'src/appointment/interfaces/appointment.service.interfaces';

@Injectable()
export class EmailService {
  private provider: EmailEngines;
  constructor(private readonly emailService: EmailEngineFactory) {
    this.provider = EmailEngines.NODE_MAILER;
  }
  @OnEvent(EProviderStatus.TOKEN_ERROR)
  sendFailedTokenGenerationMail({ subject, ...inputs }: IFailedOauthTokenMail) {
    this.emailService.findOne(this.provider).sendFailedTokenGenerationMail({
      ...inputs,
      subject: `[SERVER_ERR] ${inputs.provider} Oauth Token Error`,
    });
  }

  @OnEvent(AppointmentEvents.STARTED)
  mailGuestsToJoinAppointment(iJoinAppointment: IJoinAppointment) {
    this.emailService
      .findOne(this.provider)
      .mailGuestsToJoinAppointment(iJoinAppointment);
  }
}
