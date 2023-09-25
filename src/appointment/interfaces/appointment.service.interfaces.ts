import { Appointment } from 'src/appointment/entities/appointment.entity';

export enum EStreamRoles {
  HOST = 'HOST',
  GUEST = 'GUEST',
}

export interface IJoinAppointment {
  appointmentName: string;
  host: {
    email: string;
    firstName: string;
  };
  guestsMail: string[];
  message: string;
  subject: string;
  deeplink?: string;
}

export type StreamRoles = keyof typeof EStreamRoles;

export type GenAppLinks = {
  acceptLink: string;
  rejectLink: string;
};

export interface IAppointmentService {
  meet(inputs: any): Promise<void>;
}
