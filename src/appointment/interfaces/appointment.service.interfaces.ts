import { Appointment } from 'src/appointment/entities/appointment.entity';

export type GenAppLinks = {
  acceptLink: string;
  rejectLink: string;
};

export interface IAppointmentService {
  meet(inputs: any): Promise<void>;
}
