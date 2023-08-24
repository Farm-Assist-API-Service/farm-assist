import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
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

@Controller('api/appointments')
@UseGuards(JwtAuthGuard, RolesGuard)
@UseInterceptors(TransformInterceptor)
@UseInterceptors(LoggingInterceptor)
// @UseFilters(HttpExceptionFilter)
export class AppointmentController {
  constructor(private appointmentService: AppointmentService) {}
  @Post()
  create(
    @LoggedInProfile() profile: ProfileInformation,
    @Body() inputs: CreateAppointmentDto,
  ): Promise<Appointment> {
    return this.appointmentService.create(inputs, profile.id);
  }

  @Get()
  getAppointments(): Promise<Appointment[]> {
    return this.appointmentService.getAllAppointments();
  }

  @Get()
  getUserAppointments(
    @LoggedInUser() user: User,
    @Body() inputs: CreateAppointmentDto,
  ): Promise<Appointment[]> {
    return this.appointmentService.getUserAppointments(user);
  }

  @Put('cancel/:appointmentId')
  cancelAppointment(
    @LoggedInProfile() profile: ProfileInformation,
    @Body() inputs: CancelAppointmentDto,
    @Param('appointmentId', ParseIntPipe) appointmentId: number,
  ) {
    this.appointmentService.cancelAppointment(appointmentId, profile, inputs);
  }
}
