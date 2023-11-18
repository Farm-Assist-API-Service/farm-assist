import { Controller, Get, Param, Query, Req, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Request, Response } from 'express';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EDeeplinkEvents } from './core/enums/events/deep-link.events';
import { IDeeplinkPayload } from './core/interfaces/deep-link-payload';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  @Get('health')
  getHealthStatus(): string {
    return this.appService.getHealthStatus();
  }

  @Get('farmassist')
  handleDeeplink(
    @Res() res: Response,
    @Query('link') link: string,
    @Query('target') target: string,
    @Query('token') token: string,
  ) {
    const protocol = 'farmassist://';
    const payload: IDeeplinkPayload = {
      link: `${protocol}${link}`,
      target,
      token,
    };
    console.log({ payload });
    
    // this.eventEmitter.emit(EDeeplinkEvents[target], payload);
    res.redirect(301, payload.link);
  }
}
