import { EventEmitter2 } from '@nestjs/event-emitter';
import { readFile } from 'fs';
import { promisify } from 'util';
import { resolve } from 'path';
import * as nodemailer from 'nodemailer';
import * as handlebars from 'handlebars';
import { env } from 'src/config/config.env';
import { TemplateEvents } from 'src/core/enums/events/template.events';
import {
  IEmailService,
  MailOptions,
  EMailSource,
  IFailedOauthTokenMail,
} from 'src/notification/interfaces/email.interfaces';
import { User } from 'src/user/user.entity';
import { otpTemplate } from 'src/view/emails/otp';
import { Inject, Logger } from '@nestjs/common';
import { Appointment } from 'src/appointment/entities/appointment.entity';
import * as moment from 'moment';
import { ProfileInformation } from 'src/user/profile-information/entities/profile-information.entity';
import { ConfigService } from 'src/config/config.service';
import { GenAppLinks, IJoinAppointment } from 'src/appointment/interfaces/appointment.service.interfaces';
import { AesEncryption } from 'src/utils/helpers/aes-encryption';
import { EAppointmentActions } from 'src/appointment/enums/appointment-actions.enum';
import { DateHelpers } from 'src/utils/helpers/date.helpers';
import { FarmAssistAppointmentProviders } from 'src/appointment/enums/appointment-providers.enum';

const ReadFile = promisify(readFile);

export class Nodemailer implements IEmailService {
  private readonly transporter: any;

  private readonly logger: Logger;

  constructor(
    private readonly gene,
    private eventEmitter: EventEmitter2,
    private readonly configService: ConfigService,
    private readonly encryption: AesEncryption,
  ) {
    this.transporter = nodemailer.createTransport({
      service: env.NODE_MAILER_SERVICE_PROVIDER,
      auth: {
        user: env.NODE_MAILER_AUTH_USER,
        pass: env.NODE_MAILER_AUTH_PASS,
      },
    });
    this.logger = new Logger(Nodemailer.name);

    this.encryption = new AesEncryption(env.RSA_PRIVATE_KEY);
  }

  private async getEmailTemplate(templateName: string, context?: any) {
    this.logger.log(`Generating html...`);
    const mailsTemplate = `./src/view/emails/${templateName}.hbs`;

    const templatePath = resolve(mailsTemplate);
    const content = await ReadFile(templatePath);

    handlebars.registerHelper('ifeq', function (a, b, options) {
      if (a == b) {
        return options.fn(this);
      }
      return options.inverse(this);
    });

    handlebars.registerHelper('ifCond', function (v1, operator, v2, options) {
      switch (operator) {
        case '===':
          return v1 === v2 ? options.fn(this) : options.inverse(this);
        // Add other operators as needed...
        default:
          return options.inverse(this);
      }
    });

    // compile and render the template with handlebars
    const template = handlebars.compile(content.toString());

    return template(context);
  }

  async sendMail(inputs: MailOptions): Promise<void> {
    // const [template] = await this.eventEmitter.emitAsync(
    //   TemplateEvents.GENERATE,
    //   inputs,
    // );
    // Object.assign(inputs, { html: template, user });
    this.transporter.sendMail(inputs, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log(
          `🚚✨ Email sent successfully =====> ${inputs.to}`,
          // info.response,
        );
      }
    });
  }

  async sendOTPMail(user: User): Promise<void> {
    const template = await this.getEmailTemplate('opt', {
      user,
    });

    this.sendMail({
      from: env.APP_EMAIL,
      to: user.email,
      subject: `Welcome to Farm Assist`,
      html: template,
    });
  }

  private generateAppointmentLinks(
    appointment: Appointment,
    guest: ProfileInformation,
  ): GenAppLinks {
    const acceptCode = this.encryption.encrypt(
      JSON.stringify({
        guestId: guest.id,
        appointmentId: appointment.id,
        action: EAppointmentActions.ACCEPTED,
      }),
    );

    const rejectCode = this.encryption.encrypt(
      JSON.stringify({
        guestId: guest.id,
        appointmentId: appointment.id,
        action: EAppointmentActions.CANCELLED,
      }),
    );

    const acceptLink = `${env.APP_BASEL_URL}/appointments?action=${acceptCode}`;
    const rejectLink = `${env.APP_BASEL_URL}/appointments?action=${rejectCode}`;
    return { acceptLink, rejectLink };
  }

  async sendAppointmentMail(appointment: Appointment): Promise<void> {
    const guestEmails = appointment.guests.map((g) => g.user.email);
    // Mail host about appoinment
    this.sendMail({
      from: env.APP_EMAIL,
      to: appointment.host.user.email,
      subject: `New Appointment created!`,
      text: `You just created an appointment on "${appointment.title}" ${
        appointment.description ? `- ${appointment.description};` : ''
      } scheduled for ${DateHelpers.readableDate(
        appointment.date,
      )}. Guests: [${guestEmails.join(',')}]; Location: ${
        appointment.location
      }; Duration: ${appointment.duration}${
        appointment.unitOfTime
      }; Meeting link: ${appointment.locationLink}`,
    });

    this.logger.debug(
      `Appointmet Host ===========> ${appointment.host.user.email}`,
    );

    for (const profile of appointment.guests) {
      const appointmentLinks = this.generateAppointmentLinks(
        appointment,
        profile,
      );

      this.sendMail({
        from: env.APP_EMAIL,
        to: profile.user.email,
        subject: `You have been invited for a ${appointment.duration}${appointment.unitOfTime} appointment by ${appointment.host.user.firstName}`,
        text: `Hi ${
          profile.user.firstName
        }, I hope this message finds you well. I am ${
          appointment.host.user.firstName
        } ${appointment.host.user.lastName}. A ${
          appointment.host.profileType
        } at ${env.APP_NAME}. I wanted to extend a formal invitation for "${
          appointment.title
        }". Scheduled for ${DateHelpers.readableDate(
          appointment.date,
        )}. Appointment will last for ${appointment.duration}${
          appointment.unitOfTime
        }. Would you be available? [Yes: ${appointmentLinks.acceptLink}] [No: ${
          appointmentLinks.rejectLink
        }]`,
      });
      this.logger.debug(`Appointmet Guest ===========> ${profile.user.email}`);
    }
  }

  async sendAppointmentCancellationMail(
    appointment: Appointment,
  ): Promise<void> {
    this.sendMail({
      from: env.APP_EMAIL,
      to: appointment.host.user.email,
      subject: `Appointment cancelled!`,
      text: `You cancelled appointment on "${appointment.title}"`,
    });

    let text = `${appointment.host.user.firstName} cancelled "${appointment.title}" appointment.`;

    if (appointment.cancellation) {
      text += ` Reasons: "${appointment.cancellation.reason}"`;
    }

    for (const profile of appointment.guests) {
      this.sendMail({
        from: env.APP_EMAIL,
        to: profile.user.email,
        subject: `Appointment cancelled!`,
        text,
      });
    }
  }

  async sendAppointmentAcceptanceMail(
    guest: ProfileInformation,
    appointment: Appointment,
  ): Promise<void> {
    // Mail host of acceptance
    console.log({ guest });

    this.sendMail({
      from: env.APP_EMAIL,
      to: appointment.host.user.email,
      subject: `Appointment accepted!`,
      text: `${guest.user.firstName} accepted your appointment on "${
        appointment.title
      }." scheduled for ${DateHelpers.readableDate(appointment.date)}`,
    });

    // Mail guest meeting links
    this.sendMail({
      from: env.APP_EMAIL,
      to: guest.user.email,
      subject: `You accpeted appointment with ${appointment.host.user.firstName}`,
      text: `Here is the meeting link for "${appointment.title}" - ${
        appointment.locationLink
      }. Meeting is scheduled for ${DateHelpers.readableDate(
        appointment.date,
      )}`,
    });
  }

  async sendAppointmentRejectionMail(
    guest: ProfileInformation,
    appointment: Appointment,
  ): Promise<void> {
    // Mail host of cancellation
    this.sendMail({
      from: env.APP_EMAIL,
      to: appointment.host.user.email,
      subject: `Appointment rejected!`,
      text: `${guest.user.firstName} rejected your appointment on "${appointment.title}."`,
    });

    // Mail guest of rejection action
    this.sendMail({
      from: env.APP_EMAIL,
      to: guest.user.email,
      subject: `You rejected appointment with ${appointment.host.user.firstName}`,
      text: `You successfully cancelled out on "${appointment.title}".`,
    });
  }

  async sendFailedTokenGenerationMail(
    inputs: IFailedOauthTokenMail,
  ): Promise<void> {
    this.sendMail({
      from: `<${env.APP_EMAIL}>`,
      to: env.APP_EMAIL,
      subject: inputs.subject,
      text: inputs.message,
    });
  }

  async mailGuestsToJoinAppointment(
    iJoinAppointment: IJoinAppointment,
  ): Promise<void> {
    const payload = {
      subject: `${iJoinAppointment.host.firstName} started an appointment.`,
      // text: `Join "${iJoinAppointment.appointmentName}" here:  farmassist://farmassist.app/appointment?id=`,
      text: `"${iJoinAppointment.appointmentName}"`,
      link: iJoinAppointment.deeplink,
    };

    const template = await this.getEmailTemplate('join-appointment', payload);

     iJoinAppointment.guestsMail.forEach((email) => {
      this.sendMail({
        from: iJoinAppointment.host.email,
        to: email,
        subject: payload.subject,
        text: payload.text,
        html: template,
      });
    });
  }
}
