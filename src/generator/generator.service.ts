import { Injectable } from '@nestjs/common';

@Injectable()
export class GeneratorService {
  get generateOTP(): string {
    return Math.floor(1000 + Math.random() * 9000).toString();
  }
}
