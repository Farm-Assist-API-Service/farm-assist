import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ConfigService } from 'src/config/config.service';
import { EmailEngineFactory } from './factory';
import { Nodemailer } from './libs/nodemailer';

@Module({
  imports: [EventEmitterModule.forRoot()],
  providers: [EmailEngineFactory, Nodemailer, ConfigService],
  exports: [EmailEngineFactory, Nodemailer],
})
export class EmailModule {}
