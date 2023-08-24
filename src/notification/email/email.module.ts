import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { EmailEngineFactory } from './factory';
import { Nodemailer } from './libs/nodemailer';

@Module({
  imports: [EventEmitterModule.forRoot()],
  providers: [EmailEngineFactory, Nodemailer],
  exports: [EmailEngineFactory, Nodemailer],
})
export class EmailModule {}
