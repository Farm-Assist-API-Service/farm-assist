import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello, I am your Farm Assistant!';
  }

  getHealthStatus(): any {
    return {
      status: 'Ok!',
    };
  }
}
