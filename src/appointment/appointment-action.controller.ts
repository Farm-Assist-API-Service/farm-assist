import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Req,
  Res,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { HttpExceptionFilter } from 'src/utils/filters/http-exception.filter';
import { URLHelpers } from 'src/utils/helpers/url';
import { LoggingInterceptor } from 'src/utils/interceptors/logging.interceptor';
import { TransformInterceptor } from 'src/utils/interceptors/transform.interceptor';
import { AppointmentService } from './appointment.service';

@Controller('appointments')
@UseInterceptors(TransformInterceptor)
@UseInterceptors(LoggingInterceptor)
@UseFilters(HttpExceptionFilter)
export class AppointmentActionController {
  constructor(private appointmentService: AppointmentService) {}

  @Get()
  async actionAppointment(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<void> {
    const normalizedAction = URLHelpers.normalizeURL(req, res);
    const responseAction = await this.appointmentService.actionAppointment(
      normalizedAction,
    );
    res.status(200).json({
      success: true,
      message: `Invitation ${responseAction}!`,
    });
  }
}
