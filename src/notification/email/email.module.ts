import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ConfigService } from 'src/config/config.service';
import { EmailEngineFactory } from './factory';
import { Nodemailer } from './libs/nodemailer';
import { EmailService } from './email.service';

@Module({
  imports: [EventEmitterModule.forRoot()],
  providers: [EmailEngineFactory, Nodemailer, ConfigService, EmailService],
  exports: [EmailEngineFactory, Nodemailer, EmailService],
})
export class EmailModule {}
