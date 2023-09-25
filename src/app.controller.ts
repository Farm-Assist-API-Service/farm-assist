import { Controller, Get, Param, Query, Req, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Request, Response } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('health')
  getHealthStatus(): string {
    return this.appService.getHealthStatus();
  }

  @Get('farmassist')
  handleDeeplink(@Res() res: Response, @Query('link') link: string) {
    res.redirect(301, link);
  }
}
