import {
  TypeOrmModuleOptions,
  TypeOrmModuleAsyncOptions,
} from '@nestjs/typeorm';
import { TypeOrmNamingStrategy } from './typeorm-naming-strategy';
import { DataSource, DataSourceOptions } from 'typeorm';
import { env } from 'src/config/config.env';

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: env.TYPEORM_HOST,
  port: env.TYPEORM_PORT,
  username: env.TYPEORM_USERNAME,
  password: env.TYPEORM_PASSWORD,
  database: env.TYPEORM_DATABASE,
  entities: [`${__dirname}/../**/*.entity.{ts,js}`],
  migrations: [`${__dirname}/../migrations/*.{ts,js}`],
  namingStrategy: new TypeOrmNamingStrategy(),
  // autoLoadEntities: true,
  // synchronize: true,
  logging: env.TYPEORM_LOGGING,
  // ssl: !['test', 'development'].includes(env.NODE_ENV),
  ssl: true,
  migrationsTableName: 'migrations',
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
