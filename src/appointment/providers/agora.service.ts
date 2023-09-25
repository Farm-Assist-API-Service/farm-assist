import { promises } from 'fs';
import { RtcTokenBuilder, RtcRole } from 'agora-access-token';
import { FsService } from 'src/file/services/fs.service';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from 'src/config/config.service';
import {
  DateHelpers,
  YEAR_MONTH_DAY_DATE_FORMAT,
} from 'src/utils/helpers/date.helpers';
import { Cron, CronExpression } from '@nestjs/schedule';
import { CreateAppointmentDto } from '../dtos/create-appointment.dto';
import { ProfileInformation } from 'src/user/profile-information/entities/profile-information.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EProviderStatus } from '../enums/provider-status.enum';
import { IFailedOauthTokenMail } from 'src/notification/interfaces/email.interfaces';
import { FarmAssistAppointmentProviders } from '../enums/appointment-providers.enum';
import { StringHelpers } from 'src/utils/helpers/string';
import { Appointment } from '../entities/appointment.entity';
import { AgoraRoles, EAgoraRoles } from '../enums/providers.roles.enum';
import { AgoraPayloadDto } from '../dtos/agora-payload.dto';

interface IAgoraConfig {
  appId: string;
  appCertificate: string;
}

@Injectable()
export class AgoraService {
  private readonly logger: Logger;

  public readonly eventEmitter: EventEmitter2;

  public readonly meet: AgoraMeet;

  public readonly appConfig: IAgoraConfig;

  constructor(
    private fsService: FsService,
    private config: ConfigService,
    private __eventEmitter: EventEmitter2,
  ) {
    this.logger = new Logger(AgoraService.name);
    this.eventEmitter = this.__eventEmitter;
    this.appConfig = {
      appId: this.config.env.AGORA_APP_ID,
      appCertificate: this.config.env.AGORA_APP_CERTIFICATE,
    };
    this.meet = new AgoraMeet(this);
  }
}

class AgoraMeet {
  private readonly logger: Logger;

  constructor(private readonly agoraService: AgoraService) {
    this.logger = new Logger(AgoraMeet.name);
  }

  async createMeet(
    inputs: CreateAppointmentDto,
    host: ProfileInformation,
    guests: ProfileInformation[],
  ): Promise<string> {
    // generate channel name
    let channelName = StringHelpers.generateSlug(inputs.title);
    const currentDate = DateHelpers.addToDate(
      inputs.date,
      inputs.duration,
      inputs.unitOfTime,
    );
    const privilegeExpiredTs = DateHelpers.getTimestamp(currentDate);
    channelName = `${channelName}-${privilegeExpiredTs}`;
    return channelName;
  }

  async generateToken(
    agoraPayloadDto: AgoraPayloadDto,
    appointment: Appointment,
    role: AgoraRoles,
  ): Promise<string> {
    const config = this.agoraService.appConfig;
    let channelName = agoraPayloadDto.channelName;
    // let channelName = appointment.metaData.channelName;
    const userRole = RtcRole[role];
    const currentDate = DateHelpers.addToDate(
      appointment.date,
      appointment.duration,
      appointment.unitOfTime,
    );

    const uid = agoraPayloadDto.uid || 0;
    const privilegeExpiredTs = DateHelpers.getTimestamp(currentDate);
    // channelName = `${channelName}-${privilegeExpiredTs}`;
    console.log({channelName, userRole, uid});
    
    return RtcTokenBuilder.buildTokenWithUid(
      config.appId,
      config.appCertificate,
      channelName,
      uid,
      userRole,
      privilegeExpiredTs,
    );
  }
}
