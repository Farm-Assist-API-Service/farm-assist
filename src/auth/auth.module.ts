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

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Region]),
    GeneratorModule,
    ConfigModule,
    RegionModule,
  ],
  providers: [AuthService, RegionService],
  controllers: [AuthController],
})
export class AuthModule {}
