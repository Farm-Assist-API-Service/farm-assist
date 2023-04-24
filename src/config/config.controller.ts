import { Controller, Get } from '@nestjs/common';

@Controller('')
export class ConfigController {
  @Get('')
  // eslint-disable-next-line class-methods-use-this
  async rootRoute(): Promise<{ status: string }> {
    return { status: 'ok' };
  }
}
