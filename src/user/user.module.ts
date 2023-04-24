import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { ProfileInformationModule } from './profile-information/profile-information.module';

@Module({
  providers: [UserService],
  controllers: [UserController],
  imports: [ProfileInformationModule],
})
export class UserModule {}
