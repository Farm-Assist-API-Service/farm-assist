import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';

// Custom exceptions response is based off the Jsend spec
// https://github.com/omniti-labs/jsend
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost): any {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const exceptionStatus = exception.getStatus();
    const exceptionResponse: any = exception.getResponse();
    console.log(`exceptionResponse`, exceptionResponse);
    const isString = typeof exceptionResponse === 'string';

    // The HttpException response has a specific object structure
    let message = isString ? exceptionResponse : exceptionResponse.error;
    const data = isString ? {} : exceptionResponse.message;
    if (message === 'Bad Request' && Array.isArray(data)) {
      [message] = data;
    }

    const resPayload: any = {
      status: exceptionStatus <= 500 ? 'fail' : 'error',
      message,
      data,
    };

    if (exceptionStatus === HttpStatus.INTERNAL_SERVER_ERROR) {
      try {
        message = JSON.parse(exceptionResponse);
        resPayload.message = message?.report;
        resPayload.devLog = {
          source: message?.source,
          reason: message?.reason,
          report: message?.report,
        };
      } catch {
        // console.log(error);
      }
    }

    Logger.error(message);
    response.status(exceptionStatus).json(resPayload);
  }
}
