import { Module } from '@nestjs/common';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';

import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './modules/user/user.module';
import { User } from './modules/user/entities/user.entity';
import { AuthModule } from './modules/auth/auth.module';
// import { ConfigModule } from './modules/config/config.module';
import { TypeOrmNamingStrategy } from './modules/typeorm/typeorm-naming-strategy';

import { LoggingInterceptor } from './modules/utils/interceptors/logging.interceptor';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: +configService.get<number>('DB_PORT'),
        username: configService.get('DB_USER'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        // entities: [`${__dirname}/../**/*.entity.{ts,js}`],
        // migrations: [`${__dirname}/../migrations/*.{ts,js}`],
        //synchronize: true, //! This will purge the database automatically on server restart if set to => true. Set to => false on production env.
        namingStrategy: new TypeOrmNamingStrategy(),
        autoLoadEntities: true,
      }),
      inject: [ConfigService],
    }),
    UserModule,
    AuthModule,
    // ConfigModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule {}
