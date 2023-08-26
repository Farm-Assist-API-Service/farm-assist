import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { AppointmentEvents } from 'src/core/enums/events/appointment.events';
import { Services } from 'src/core/interfaces/services';
import { EmailEngineFactory } from 'src/notification/email/factory';
import { EmailEngines } from 'src/notification/enums/email-engines.enum';
import { ProfileInformation } from 'src/user/profile-information/entities/profile-information.entity';
import { ProfileReview } from 'src/user/profile-information/entities/profile-review.entity';
import { EProfileStatus } from 'src/user/profile-information/enums/profile-status.enum';
import { User } from 'src/user/user.entity';
import { DateHelpers } from 'src/utils/helpers/date.helpers';
import { HandleHttpExceptions } from 'src/utils/helpers/handle-http-exceptions';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { CancelAppointmentDto } from './dtos/cancel-appointment.dto';
import { CreateAppointmentDto } from './dtos/create-appointment.dto';
import { Appointment } from './entities/appointment.entity';
import { EAppointmentStatus } from './enums/appointment-status.enum';
import { GoogleService } from './providers/google.service';

@Injectable()
export class AppointmentService implements Services {
  private logger: Logger;
  constructor(
    private readonly eventEmitter: EventEmitter2,
    @InjectRepository(Appointment)
    private readonly appointmentRepo: Repository<Appointment>,
    @InjectRepository(ProfileInformation)
    private readonly profileRepo: Repository<ProfileInformation>,
    private readonly emailService: EmailEngineFactory,
    private readonly googleService: GoogleService,
  ) {
    this.logger = new Logger(AppointmentService.name);
  }

  async create(
    inputs: CreateAppointmentDto,
    profileId: number,
  ): Promise<Appointment> {
    try {
      const guests: ProfileInformation[] = [];
      const profiles = await this.profileRepo
        .createQueryBuilder('profileInformation')
        .leftJoinAndSelect('profileInformation.user', 'user')
        .where(`profileInformation.status = '${EProfileStatus.ACTIVE}'`)
        .andWhere('user.isActive = true')
        .getMany();

      const profileIds = new Set(profiles.map((p) => p.id));
      const host = profiles.find((p) => p.id === profileId);

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
        // Exclude host
        if (id !== host.id) {
          guests.push(profiles.find((each) => each.id === id));
        }
      });

      // TODO: Change to Appointment Provider. Use this one as default
      const locationLink = await this.googleService.meet.createMeet();

      const newAppointment = this.appointmentRepo.create({
        ...inputs,
        host,
        guests,
        locationLink,
      });

      this.logger.log('Before appointment creation');
      const appointment = await this.appointmentRepo.save(newAppointment);
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

  async findOne(findOneOpt: FindOneOptions): Promise<Appointment> {
    return this.appointmentRepo.findOne(findOneOpt);
  }

  findOneById(
    id: number,
    findOneOptions?: FindOneOptions,
  ): Promise<Appointment> {
    findOneOptions.where['id'] = id;
    return this.appointmentRepo.findOne(findOneOptions);
  }

  findMany(findOneOpt: FindManyOptions): Promise<Appointment[]> {
    return this.appointmentRepo.find(findOneOpt);
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
  async notify(newAppointment: Appointment): Promise<void> {
    this.logger.log('New apoointed created');

    // Notify Guests of appointments
    await this.emailService
      .findOne(EmailEngines.NODE_MAILER)
      .sendAppointmentMail(newAppointment);
  }

  async cancelAppointment(
    appointmentId: number,
    profile: ProfileInformation,
    cancelAppointmentDto: CancelAppointmentDto,
  ): Promise<void> {
    try {
      const appointment = await this.appointmentRepo.findOne({
        where: { id: appointmentId },
        relations: ['guests', 'host'],
      });

      if (appointment.status === EAppointmentStatus.CANCELLED) {
        throw new HttpException(
          'Invalid appointment ',
          HttpStatus.NOT_ACCEPTABLE,
        );
      }

      if (!appointment) {
        throw new HttpException('Invalid appointment ', HttpStatus.BAD_REQUEST);
      }

      if (appointment) {
        const isHost = appointment.host.id === profile.id;
        this.logger.log(`Cancel appointment ====> ${appointment.title}`);

        if (!isHost) {
          throw new HttpException(
            'Unknown host request',
            HttpStatus.BAD_REQUEST,
          );
        }

        Object.assign(appointment, {
          status: EAppointmentStatus.CANCELLED,
          cancellation: {
            reason: cancelAppointmentDto.reason,
            cancelledAt: DateHelpers.now(),
          },
        });

        const updatedAppointment = await this.appointmentRepo.save(appointment);
        // Notify Guests of cancellation
        await this.emailService
          .findOne(EmailEngines.NODE_MAILER)
          .sendAppointmentCancellationMail(updatedAppointment);
      }
    } catch (error) {
      this.logger.error(error);
      new HandleHttpExceptions({
        error,
        source: {
          service: AppointmentService.name,
          operator: this.cancelAppointment.name,
        },
        report: 'Error cancelling appointment',
      });
    }
  }

  async acceptAppointment(
    appointmentId: number,
    guestId: number,
  ): Promise<void> {
    try {
      const appointment = await this.appointmentRepo.findOne({
        where: { id: appointmentId },
        relations: ['host'],
      });

      if (appointment.status === EAppointmentStatus.CANCELLED) {
        throw new HttpException(
          'Invalid appointment ',
          HttpStatus.NOT_ACCEPTABLE,
        );
      }

      if (appointment) {
        this.logger.log(`Accepted appointment ====> ${appointment.title}`);

        const guest = await this.profileRepo.findOne({
          where: { id: guestId },
          relations: ['user'],
        });

        // Notify Guests of acceptance
        await this.emailService
          .findOne(EmailEngines.NODE_MAILER)
          .sendAppointmentAcceptanceMail(guest, appointment);
      }
    } catch (error) {
      this.logger.error(error);
      new HandleHttpExceptions({
        error,
        source: {
          service: AppointmentService.name,
          operator: this.cancelAppointment.name,
        },
        report: 'Error accept appointment',
      });
    }
  }
}
