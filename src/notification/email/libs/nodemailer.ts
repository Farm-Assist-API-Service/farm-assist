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
} from 'src/notification/interfaces/email.interfaces';
import { User } from 'src/user/user.entity';
import { otpTemplate } from 'src/view/emails/otp';
import { Logger } from '@nestjs/common';
import { Appointment } from 'src/appointment/entities/appointment.entity';
import * as moment from 'moment';
import { ProfileInformation } from 'src/user/profile-information/entities/profile-information.entity';

const ReadFile = promisify(readFile);

export class Nodemailer implements IEmailService {
  private readonly transporter: any;

  private readonly logger: Logger;

  constructor(private readonly gene, private eventEmitter: EventEmitter2) {
    this.transporter = nodemailer.createTransport({
      service: env.NODE_MAILER_SERVICE_PROVIDER,
      auth: {
        user: env.NODE_MAILER_AUTH_USER,
        pass: env.NODE_MAILER_AUTH_PASS,
      },
    });
    this.logger = new Logger(Nodemailer.name);
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
          `✨ Email sent successfully =====> ${inputs.to}`,
          info.response,
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

  async sendAppointmentMail(appointment: Appointment): Promise<void> {
    const guestEmails = appointment.guests.map((g) => g.user.email);

    this.sendMail({
      from: env.APP_EMAIL,
      to: appointment.host.user.email,
      subject: `New Appointment created!`,
      text: `Title: ${appointment.title}; Description: ${
        appointment.description
      }; Guests: [${guestEmails.join(',')}]; Location: ${
        appointment.location
      }; Duration: ${appointment.duration}${appointment.unitOfTime}`,
    });

    const acceptLink = `${env.APP_BASEL_URL}/accept/${appointment.id}`;
    const rejectLink = `${env.APP_BASEL_URL}/reject/${appointment.id}`;

    for (const profile of appointment.guests) {
      this.sendMail({
        from: env.APP_EMAIL,
        to: profile.user.email,
        subject: `You have been invited for a ${appointment.duration}${appointment.unitOfTime} appointment by ${appointment.host.user.firstName}`,
        text: `Hi ${
          profile.user.firstName
        }, I hope this message finds you well. I wanted to extend a formal invitation for "${
          appointment.title
        }". Date: ${moment(appointment.date).format('LL')};  Host: ${
          appointment.host.user.firstName
        } ${appointment.host.user.lastName}; Location: ${
          appointment.location
        }; Duration: ${appointment.duration}${
          appointment.unitOfTime
        }; ###[Accept Appointment: ${acceptLink}; Reject Appointment: ${rejectLink}]`,
      });
    }
  }

  async sendAppointmentCancellationMail(
    appointment: Appointment,
  ): Promise<void> {
    this.sendMail({
      from: env.APP_EMAIL,
      to: appointment.host.user.email,
      subject: `Appointment cancelled!`,
      text: `You cancelled "${appointment.title}" Appointment`,
    });

    for (const profile of appointment.guests) {
      this.sendMail({
        from: env.APP_EMAIL,
        to: profile.user.email,
        subject: `You have been invited for a ${appointment.duration}${appointment.unitOfTime} appointment by ${appointment.host.user.firstName}`,
        text: `Hi ${profile.user.firstName}, The appointment "${appointment.title}" was cancelled by${appointment.host.user.firstName}.`,
        // text: `Hi ${profile.user.firstName}, apologies. The appointment "${appointment.title}" was cancelled by${appointment.host.user.firstName} due to ${appointment.cancellation.reason}.`,
      });
    }
  }
}
