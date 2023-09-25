import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from 'src/config/config.service';
import { AppointmentEvents } from 'src/core/enums/events/appointment.events';
import { Services } from 'src/core/interfaces/services';
import { EmailEngineFactory } from 'src/notification/email/factory';
import { EmailEngines } from 'src/notification/enums/email-engines.enum';
import { ProfileInformation } from 'src/user/profile-information/entities/profile-information.entity';
import { ProfileReview } from 'src/user/profile-information/entities/profile-review.entity';
import { EProfileStatus } from 'src/user/profile-information/enums/profile-status.enum';
import { User } from 'src/user/user.entity';
import { AesEncryption } from 'src/utils/helpers/aes-encryption';
import { DateHelpers } from 'src/utils/helpers/date.helpers';
import { HandleHttpExceptions } from 'src/utils/helpers/handle-http-exceptions';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { CancelAppointmentDto } from './dtos/cancel-appointment.dto';
import { CreateAppointmentDto } from './dtos/create-appointment.dto';
import { Appointment } from './entities/appointment.entity';
import { EAppointmentStatus } from './enums/appointment-status.enum';
import { GoogleService } from './providers/google.service';
import { env } from 'src/config/config.env';
import { EAppointmentActions } from './enums/appointment-actions.enum';
import { AgoraService } from './providers/agora.service';
import { ELocation } from 'src/core/enums/location.enum';
import { EAgoraRoles } from './enums/providers.roles.enum';
import {
  EStreamRoles,
  StreamRoles,
} from './interfaces/appointment.service.interfaces';
import { AgoraPayloadDto } from './dtos/agora-payload.dto';

@Injectable()
export class AppointmentService implements Services {
  private logger: Logger;

  protected encryption: AesEncryption;

  constructor(
    private readonly eventEmitter: EventEmitter2,
    @InjectRepository(Appointment)
    private readonly appointmentRepo: Repository<Appointment>,
    @InjectRepository(ProfileInformation)
    private readonly profileRepo: Repository<ProfileInformation>,
    private readonly emailService: EmailEngineFactory,
    private readonly googleService: GoogleService,
    private readonly agoraService: AgoraService,
  ) {
    this.logger = new Logger(AppointmentService.name);
    this.encryption = new AesEncryption(env.RSA_PRIVATE_KEY);
  }

  async create(
    inputs: CreateAppointmentDto,
    profile: ProfileInformation,
    user: User,
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
      const host = profiles.find((p) => p.id === profile.id);

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
        if (profiles.find((each) => each.id === id).userId !== user.id) {
          guests.push(profiles.find((each) => each.id === id));
        }
      });

      let newAppointment: Appointment;
      // TODO: Change to Appointment Provider. Use this one as default
      // inputs.location determines what Meeting provider to use
      if (inputs.location === ELocation.AGORA) {
        const channelName = await this.agoraService.meet.createMeet(
          inputs,
          host,
          guests,
        ); // Default Meeting Provider
        newAppointment = this.appointmentRepo.create({
          ...inputs,
          host,
          guests,
          metaData: {
            channelName,
          },
        });
      } else if (inputs.location === ELocation.MEET) {
        const locationLink = await this.googleService.meet.createMeet(
          inputs,
          host,
          guests,
        );
        newAppointment = this.appointmentRepo.create({
          ...inputs,
          host,
          guests,
          locationLink,
        });
      } else {
        throw new HttpException(
          `${inputs.location} service is unavailable`,
          HttpStatus.NOT_ACCEPTABLE,
        );
      }

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

  deleteAll() {
    this.appointmentRepo.delete({});
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
    this.logger.log('New appointed created');

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

      if (!appointment) {
        throw new HttpException('Invalid appointment', HttpStatus.BAD_REQUEST);
      }

      // if (appointment.status === EAppointmentStatus.CANCELLED) {
      //   throw new HttpException(
      //     'Appointment was cancelled',
      //     HttpStatus.NOT_ACCEPTABLE,
      //   );
      // }

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
        // Notify Guests & Host of cancellation
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

  async actionAppointment(token: string): Promise<EAppointmentActions> {
    try {
      const decrytedLinks = JSON.parse(this.encryption.decrypt(token));
      const appointment = await this.appointmentRepo.findOne({
        where: { id: decrytedLinks.appointmentId },
        relations: ['host', 'guests'],
      });

      if (appointment.status === EAppointmentStatus.CANCELLED) {
        throw new HttpException(
          'Invalid appointment ',
          HttpStatus.NOT_ACCEPTABLE,
        );
      }

      const guest = await this.profileRepo.findOne({
        where: { id: decrytedLinks.guestId },
        relations: ['user'],
      });

      decrytedLinks.action === EAppointmentActions.ACCEPTED
        ? this.acceptAppointment(appointment, guest)
        : this.rejectAppointment(appointment, guest);

      return EAppointmentActions[decrytedLinks.action.toUpperCase()];
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

  async acceptAppointment(
    appointment: Appointment,
    guest: ProfileInformation,
  ): Promise<void> {
    this.logger.log(`Accepted appointment on ====> ${appointment.title}`);
    // Notify host & guest of acceptance
    await this.emailService
      .findOne(EmailEngines.NODE_MAILER)
      .sendAppointmentAcceptanceMail(guest, appointment);
  }

  async rejectAppointment(
    appointment: Appointment,
    guest: ProfileInformation,
  ): Promise<void> {
    this.logger.log(`Rejected appointment on ====> ${appointment.title}`);

    const guests = appointment.guests.filter((p) => p.id !== guest.id);
    appointment.guests = guests;
    await this.appointmentRepo.save(appointment);
    // Notify Guests of acceptance
    await this.emailService
      .findOne(EmailEngines.NODE_MAILER)
      .sendAppointmentRejectionMail(guest, appointment);
  }

  async adjustAppointment(appointment: Appointment): Promise<void> {}

  async generateAgoraToken(
    agoraPayloadDto: AgoraPayloadDto,
    profile: ProfileInformation,
    appointmentId: number,
  ): Promise<string> {
    try {
      const appointment = await this.appointmentRepo.findOne({
        where: {
          id: appointmentId,
        },
        relations: ['host', 'guests'],
      });

      if (!appointment) {
        throw new HttpException('Invalid appointment', HttpStatus.BAD_REQUEST);
      }

      if (ELocation.AGORA === appointment.location) {
        if (EStreamRoles[agoraPayloadDto.role] === EStreamRoles.HOST) {
          if (agoraPayloadDto.uid !== appointment.host.id) {
            throw new HttpException('Invalid host', HttpStatus.NOT_ACCEPTABLE);
          }
          return this.agoraService.meet.generateToken(
            agoraPayloadDto,
            appointment,
            'PUBLISHER',
          );
        } else {
          const guest = appointment.guests.find(
            (g) => g.id === agoraPayloadDto.uid,
          );
          if (!guest) {
            throw new HttpException('Invalid guest', HttpStatus.NOT_ACCEPTABLE);
          }
          return this.agoraService.meet.generateToken(
            agoraPayloadDto,
            appointment,
            'SUBSCRIBER',
          );
        }
      } else {
        throw new HttpException(
          `Sorry. ${appointment.location} service is unavailable. Only appointment(s) scheduled on ${ELocation.AGORA} are accepted`,
          HttpStatus.NOT_ACCEPTABLE,
        );
      }
    } catch (error) {
      new HandleHttpExceptions({
        error,
        source: {
          service: AppointmentService.name,
          operator: this.generateAgoraToken.name,
        },
        report: 'Error generating token for appointment',
      });
    }
  }
}
