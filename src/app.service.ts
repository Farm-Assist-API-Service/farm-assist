import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';

@Injectable()
export class AppService {
  constructor(private readonly connection: Connection) {}
  getHealthStatus(): any {
    const isConnected = this.connection.isInitialized;
    return {
      status: 'Ok!',
      database: (isConnected && 'ok') || 'down',
    };
  }
}
