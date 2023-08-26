import { Appointment } from 'src/appointment/entities/appointment.entity';

export interface IAppointmentService {
  meet(inputs: any): Promise<void>;
}
