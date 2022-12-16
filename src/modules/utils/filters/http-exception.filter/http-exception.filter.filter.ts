/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable class-methods-use-this */

import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilterFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost): any {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const exceptionStatus = exception.getStatus();
    const exceptionResponse: any = exception.getResponse();
    console.log(`exceptionResponse`, exceptionResponse);
    const isString = typeof exceptionResponse === 'string';

    let message = isString ? exceptionResponse : exceptionResponse.error;
    const data = isString ? {} : exceptionResponse.message;
    if (message === 'Bad Request' && Array.isArray(data)) {
      [message] = data;
    }
    const nonServerError = exceptionStatus <= 500;
    Logger.error(message);
    response.status(exceptionStatus).json({
      status: nonServerError ? 'failed' : 'error',
      message,
      data,
    });
  }
}
