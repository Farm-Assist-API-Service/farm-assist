import { Module } from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { AppointmentController } from './appointment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appointment } from './entities/appointment.entity';
import { ProfileInformation } from 'src/user/profile-information/entities/profile-information.entity';
import { EmailModule } from 'src/notification/email/email.module';
import { GoogleService } from './providers/google.service';
import { FsService } from 'src/file/services/fs.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Appointment, ProfileInformation]),
    EmailModule,
  ],
  providers: [AppointmentService, GoogleService, FsService],
  controllers: [AppointmentController],
})
export class AppointmentModule {}
