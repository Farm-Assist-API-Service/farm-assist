import { Module } from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Conversation } from './entities/conversation.entity';
import { ConversationController } from './conversation.controller';
import { ProfileInformationService } from 'src/user/profile-information/profile-information.service';
import { ProfileInformationModule } from 'src/user/profile-information/profile-information.module';

@Module({
  providers: [ConversationService],
  imports: [TypeOrmModule.forFeature([Conversation]), ProfileInformationModule],
  controllers: [ConversationController],
})
export class ConversationModule {}
