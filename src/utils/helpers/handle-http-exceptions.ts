import { HttpException, HttpStatus, Logger } from '@nestjs/common';

type S = {
  service: string;
  operator: string;
};

type C = {
  source: S;
  error: Partial<Error> & { status: number };
  report: string;
};

export class HandleHttpExceptions {
  constructor(input: C, logger = false) {
    const log = new Logger(input.source.service);
    if (logger) {
      log.error(
        {
          source: {
            service: input.source.service,
            operator: input.source.operator,
          },
        },
        `>>>>>>>>>>>>>>>>>>>>> ${input.report} - ${input.error?.message} <<<<<<<<<<<<<<<<<<<<`,
      );
    }

    let data: any = JSON.stringify({
      source: { ...input.source },
      message: input.error?.message || '',
      reason: input.error?.message,
      report: input.report,
    });

    if (
      [
        HttpStatus.BAD_REQUEST,
        HttpStatus.CONFLICT,
        HttpStatus.NOT_ACCEPTABLE,
        HttpStatus.EXPECTATION_FAILED,
      ].includes(input.error?.status)
    ) {
      data = input.error?.message;
    }

    throw new HttpException(
      data,
      input.error?.status || HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
