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
import { GeneratorModule } from './generator/generator.module';
import { InvitesModule } from './invites/invites.module';

@Module({
  imports: [
    TypeormModule,
    ConfigModule,
    UserModule,
    RegionModule,
    PaymentModule,
    AuthModule,
    GeneratorModule,
    InvitesModule,
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
