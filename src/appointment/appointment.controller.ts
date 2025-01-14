import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { ProfileInformation } from 'src/user/profile-information/entities/profile-information.entity';
import { User } from 'src/user/user.entity';
import { LoggedInProfile } from 'src/utils/decorators/logged-in-profile.decorator';
import { LoggedInUser } from 'src/utils/decorators/logged-in-user.decorator';
import { HttpExceptionFilter } from 'src/utils/filters/http-exception.filter';
import { LoggingInterceptor } from 'src/utils/interceptors/logging.interceptor';
import { TransformInterceptor } from 'src/utils/interceptors/transform.interceptor';
import { AppointmentService } from './appointment.service';
import { CancelAppointmentDto } from './dtos/cancel-appointment.dto';
import { CreateAppointmentDto } from './dtos/create-appointment.dto';
import { Appointment } from './entities/appointment.entity';
import { Roles } from 'src/utils/decorators/roles.decorator';
import { UserRoles } from 'src/core/enums/roles.enum';
import { AgoraPayloadDto } from './dtos/agora-payload.dto';
import { EStreamRoles } from './interfaces/appointment.service.interfaces';

@Controller('appointments')
@UseGuards(JwtAuthGuard, RolesGuard)
@UseInterceptors(TransformInterceptor)
@UseInterceptors(LoggingInterceptor)
@UseFilters(HttpExceptionFilter)
export class AppointmentController {
  constructor(private appointmentService: AppointmentService) {}
  @Post()
  create(
    @LoggedInProfile() profile: ProfileInformation,
    @LoggedInUser() user: User,
    @Body() inputs: CreateAppointmentDto,
  ): Promise<Appointment> {
    return this.appointmentService.create(inputs, profile, user);
  }

  @Get()
  getAppointments(): Promise<Appointment[]> {
    return this.appointmentService.getAllAppointments({
      relations: ['guests', 'host'],
    });
  }

  @Get()
  async getUserAppointments(
    @LoggedInUser() user: User,
    @Body() inputs: CreateAppointmentDto,
  ): Promise<Appointment[]> {
    return await this.appointmentService.getUserAppointments(user);
  }

  @Put('cancel/:appointmentId')
  async cancelAppointment(
    @LoggedInProfile() profile: ProfileInformation,
    @Body() inputs: CancelAppointmentDto,
    @Param('appointmentId', ParseIntPipe) appointmentId: number,
  ) {
    if (!appointmentId) {
      throw new HttpException('appointmentId required', HttpStatus.BAD_REQUEST);
    }
    await this.appointmentService.cancelAppointment(
      appointmentId,
      profile,
      inputs,
    );
  }

  @Roles(UserRoles.ADMIN)
  @Delete()
  async deleteAllAppointments() {
    this.appointmentService.deleteAll();
  }

  @Patch('host/:appointmentId')
  hostAppointment(
    @LoggedInProfile() host: ProfileInformation,
    @Param('appointmentId', ParseIntPipe) appointmentId: number,
    @Body() agoraPayloadDto: AgoraPayloadDto,
  ) {
    Object.assign(agoraPayloadDto, {
      role: EStreamRoles.HOST,
    });
    return this.appointmentService.generateAgoraToken(
      agoraPayloadDto,
      host,
      appointmentId,
    );
  }

  @Patch('join/:appointmentId')
  joinAppointment(
    @LoggedInProfile() guest: ProfileInformation,
    @Param('appointmentId', ParseIntPipe) appointmentId: number,
    @Body() agoraPayloadDto: AgoraPayloadDto,
  ) {
    Object.assign(agoraPayloadDto, {
      role: EStreamRoles.GUEST,
    });
    return this.appointmentService.generateAgoraToken(
      agoraPayloadDto,
      guest,
      appointmentId,
    );
  }
}
