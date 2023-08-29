import { Appointment } from 'src/appointment/entities/appointment.entity';
import { ProfileInformation } from 'src/user/profile-information/entities/profile-information.entity';
import { User } from 'src/user/user.entity';

export type MailOptions = {
  from: string;
  to: string;
  text?: string;
  html?: string;
  subject: string;
  source?: string;
  user?: User;
};

export enum EMailSource {
  FARM_ASSIST = 'Farm Assist',
}

export type MailSourceType = keyof typeof EMailSource;

export type MailContentTypes = 'text/plain' | 'application/pdf' | 'image/gif';

export interface MailAttachment {
  encoding: 'base64';
  filename: string;
  content: string; // base64 value
  contentType: MailContentTypes;
}

export interface IEmailService {
  sendMail(inputs: MailOptions): Promise<void>;
  sendOTPMail(user: User): Promise<void>;
  sendAppointmentMail(appointment: Appointment): Promise<void>;
  sendAppointmentCancellationMail(appointment: Appointment): Promise<void>;
  sendAppointmentAcceptanceMail(
    guest: ProfileInformation,
    appointment: Appointment,
  ): Promise<void>;
  sendAppointmentRejectionMail(
    guest: ProfileInformation,
    appointment: Appointment,
  ): Promise<void>;
}
