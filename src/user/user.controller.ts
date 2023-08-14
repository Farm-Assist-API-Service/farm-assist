import { Controller, UseFilters, UseInterceptors } from '@nestjs/common';
import { HttpExceptionFilter } from 'src/utils/filters/http-exception.filter';
import { LoggingInterceptor } from 'src/utils/interceptors/logging.interceptor';
import { TransformInterceptor } from 'src/utils/interceptors/transform.interceptor';

@Controller('user')
@UseInterceptors(TransformInterceptor)
@UseInterceptors(LoggingInterceptor)
@UseFilters(HttpExceptionFilter)
export class UserController {}
