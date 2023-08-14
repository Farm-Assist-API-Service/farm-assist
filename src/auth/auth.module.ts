import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { GeneratorModule } from 'src/generator/generator.module';
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

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Region, ProfileInformation]),
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
    GeneratorModule,
    ConfigModule,
    RegionModule,
    JwtModule,
  ],
  providers: [AuthService, RegionService, UserService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
