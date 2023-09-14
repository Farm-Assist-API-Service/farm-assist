import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from './config/config.module';
import { TypeormModule } from './typeorm/typeorm.module';
import { UserModule } from './user/user.module';
import { RegionModule } from './region/region.module';
import { PaymentModule } from './payment/payment.module';
import { AuthModule } from './auth/auth.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoggingInterceptor } from './utils/interceptors/logging.interceptor';
import { FileModule } from './file/file.module';
import { InvitesModule } from './invites/invites.module';
import { AppointmentModule } from './appointment/appointment.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { NotificationModule } from './notification/notification.module';
import { FarmModule } from './farm/farm.module';

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    TypeormModule,
    ConfigModule,
    UserModule,
    RegionModule,
    PaymentModule,
    AuthModule,
    FileModule,
    InvitesModule,
    AppointmentModule,
    NotificationModule,
    FarmModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule {}
