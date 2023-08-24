import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { EmailModule } from './email/email.module';

@Module({
  providers: [NotificationService],
  imports: [EmailModule],
})
export class NotificationModule {}
