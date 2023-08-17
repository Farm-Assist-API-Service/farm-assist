import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { AppointmentEvents } from 'src/core/enums/events/appointment.events';
import { Services } from 'src/core/interfaces/services';
import { ProfileInformation } from 'src/user/profile-information/entities/profile-information.entity';
import { ProfileReview } from 'src/user/profile-information/entities/profile-review.entity';
import { EProfileStatus } from 'src/user/profile-information/enums/profile-status.enum';
import { User } from 'src/user/user.entity';
import { HandleHttpExceptions } from 'src/utils/helpers/handle-http-exceptions';
import { FindManyOptions, Repository } from 'typeorm';
import { CreateAppointmentDto } from './dtos/create-appointment.dto';
import { Appointment } from './entities/appointment.entity';

@Injectable()
export class AppointmentService implements Services {
  private logger: Logger;
  constructor(
    private readonly eventEmitter: EventEmitter2,
    @InjectRepository(Appointment)
    private readonly appointmentRepo: Repository<Appointment>,
    @InjectRepository(ProfileInformation)
    private readonly profileRepo: Repository<ProfileInformation>,
  ) {
    this.logger = new Logger(AppointmentService.name);
  }

  async create(inputs: CreateAppointmentDto, user: User): Promise<Appointment> {
    try {
      const guests: ProfileInformation[] = [];
      const profiles = await this.profileRepo
        .createQueryBuilder('profileInformation')
        .leftJoinAndSelect('profileInformation.user', 'user')
        .where(`profileInformation.status = '${EProfileStatus.ACTIVE}'`)
        .andWhere('user.isActive = true')
        .getMany();

      const profileIds = new Set(profiles.map((p) => p.id));
      const host = profiles.find((p) => p.id === user.profileInformation[0].id);

      if (!host) {
        throw new HttpException(
          'Profile does not exist on host account',
          HttpStatus.BAD_REQUEST,
        );
      }

      if (!inputs.guestIds.length) {
        throw new HttpException(
          'No guest found for appointment',
          HttpStatus.NOT_ACCEPTABLE,
        );
      }

      inputs.guestIds.forEach((id) => {
        if (!profileIds.has(id)) {
          const error = `Profile error: ${JSON.stringify(
            `Could not find guest with the id: ${id}`,
          )}`;
          this.logger.error(error);
          throw new HttpException(error, HttpStatus.BAD_REQUEST);
        }
        guests.push(profiles.find((each) => each.id === id));
      });

      const newAppointment = this.appointmentRepo.create({
        ...inputs,
        host,
        guests,
      });
      this.logger.log('Before appointment creation');
      const appointment = this.appointmentRepo.save(newAppointment);
      this.logger.log('After appointment creation');

      this.eventEmitter.emit(AppointmentEvents.CREATE, appointment);
      return appointment;
    } catch (error) {
      new HandleHttpExceptions({
        error,
        source: {
          service: AppointmentService.name,
          operator: this.create.name,
        },
        report: 'Error creating appointment',
      });
    }
  }

  async getAllAppointments(
    whereOpts: FindManyOptions<Appointment> = {},
  ): Promise<Appointment[]> {
    return this.appointmentRepo.find(whereOpts);
  }

  async getUserAppointments(user: User): Promise<Appointment[]> {
    return this.appointmentRepo.find({});
  }

  @OnEvent(AppointmentEvents.CREATE)
  async notify(newAppointment): Promise<void> {
    this.logger.log('New apoointed created');

    // Notify Guests of appointments
    console.log(newAppointment);
  }
}