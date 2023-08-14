import {
  TypeOrmModuleAsyncOptions,
  TypeOrmModuleOptions,
} from '@nestjs/typeorm';
import { TypeOrmNamingStrategy } from './typeorm-naming-strategy';
import ormOptions from './ormconfig.postgres';
import { env } from 'src/config/config.env';

export const typeOrmAysncConfig: TypeOrmModuleAsyncOptions = {
  useFactory: async (): Promise<TypeOrmModuleOptions> => {
    return ormOptions.options;
  },
};
