import { Injectable, Logger } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

import { ConfigService } from '../config/config.service';

// eslint-disable-next-line import/namespace
import * as postgres from './ormconfig.postgres';

@Injectable()
export class TypeOrmOptionsService implements TypeOrmOptionsFactory {
  constructor(private readonly config: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    Logger.debug('Init', this.constructor.name);

    if (this.config.env.TYPEORM_TYPE === 'auto') {
      return postgres;
    }

    const ormOptions = {
      postgres,
    };
    console.log(ormOptions[this.config.env.TYPEORM_TYPE], 'TYPEORM_TYPE');
    return ormOptions[this.config.env.TYPEORM_TYPE];
  }
}
