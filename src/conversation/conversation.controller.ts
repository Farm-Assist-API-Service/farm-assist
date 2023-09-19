import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { LoggedInProfile } from 'src/utils/decorators/logged-in-profile.decorator';
import { ProfileInformation } from 'src/user/profile-information/entities/profile-information.entity';
import { PaginateDto } from 'src/core/dtos/paginate.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { LoggingInterceptor } from 'src/utils/interceptors/logging.interceptor';
import { TransformInterceptor } from 'src/utils/interceptors/transform.interceptor';
import { IChat } from './interfaces';
import { SendMessageDto } from './dtos/send-message-dto';

@Controller('api/conversations')
@UseGuards(JwtAuthGuard, RolesGuard)
@UseInterceptors(TransformInterceptor)
@UseInterceptors(LoggingInterceptor)
export class ConversationController {
  constructor(private conversationService: ConversationService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  sendMessage(
    @LoggedInProfile() profile: ProfileInformation,
    @Body() sendMessageDto: SendMessageDto
  ): Promise<IChat[]> {
    return this.conversationService.sendMessage(profile, sendMessageDto);
  }

  @Get('me')
  getMyConversations(@LoggedInProfile() profile: ProfileInformation) {
    return this.conversationService.getMyConversations(profile);
  }

  @Get()
  getConversations(@Body() paginateDto: PaginateDto) {
    return this.conversationService.findAll(paginateDto);
  }
}