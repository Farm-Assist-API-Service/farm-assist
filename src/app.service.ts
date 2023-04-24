import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHealthStatus(): any {
    return {
      status: 'Ok!',
    };
  }
}
