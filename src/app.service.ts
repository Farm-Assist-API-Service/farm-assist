import { Injectable, Logger, Res } from '@nestjs/common';
import { Connection } from 'typeorm';
import { Response } from 'express';

@Injectable()
export class AppService {
  private logger: Logger;
  constructor(private readonly connection: Connection) {
    this.logger = new Logger(AppService.name);
  }
  getHealthStatus(): any {
    const isConnected = this.connection.isInitialized;
    return {
      status: 'Ok!',
      database: (isConnected && 'ok') || 'down',
    };
  }
}
