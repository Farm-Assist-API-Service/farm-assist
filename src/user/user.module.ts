import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { ProfileInformationModule } from './profile-information/profile-information.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { ProfileInformation } from './profile-information/entities/profile-information.entity';

@Module({
  providers: [UserService],
  exports: [UserService],
  controllers: [UserController],
  imports: [
    TypeOrmModule.forFeature([User, ProfileInformation]),
    ProfileInformationModule,
  ],
})
export class UserModule {}
