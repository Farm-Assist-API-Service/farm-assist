import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { FileModule } from 'src/file/file.module';
import { ConfigModule } from 'src/config/config.module';
import { Region } from 'src/region/entities/region.entity';
import { RegionService } from 'src/region/region.service';
import { RegionModule } from 'src/region/region.module';
import { UserService } from 'src/user/user.service';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { ConfigService } from 'src/config/config.service';
import { PassportModule } from '@nestjs/passport';
import { AuthOptionsService } from './auth-options.service';
import { JwtStrategy } from './strategy/jwt.strategy';
import { ProfileInformation } from 'src/user/profile-information/entities/profile-information.entity';
import { EmailModule } from 'src/notification/email/email.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { GoogleService } from 'src/appointment/providers/google.service';
import { PasswordHistory } from 'src/user/entities/password-history.entity';

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    TypeOrmModule.forFeature([
      User,
      Region,
      ProfileInformation,
      PasswordHistory,
    ]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService): JwtModuleOptions => ({
        // "jsonwebtoken" option to sign
        secret: config.env.JWT_SECRET,
        signOptions: {
          expiresIn: config.env.JWT_EXPIRES_IN,
        },
      }),
    }),
    PassportModule.registerAsync({
      imports: [ConfigModule],
      useClass: AuthOptionsService,
    }),
    FileModule,
    ConfigModule,
    RegionModule,
    JwtModule,
    EmailModule,
  ],
  providers: [
    AuthService,
    RegionService,
    UserService,
    JwtStrategy,
    GoogleService,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
