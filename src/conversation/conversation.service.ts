import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Conversation } from './entities/conversation.entity';
import { FindManyOptions, Repository } from 'typeorm';
import { PaginateDto } from 'src/core/dtos/paginate.dto';
import { HandleHttpExceptions } from 'src/utils/helpers/handle-http-exceptions';
import { ProfileInformation } from 'src/user/profile-information/entities/profile-information.entity';
import { SendMessageDto } from './dtos/send-message-dto';
import { IChat } from './interfaces';
import { DateHelpers } from 'src/utils/helpers/date.helpers';
import { ProfileInformationService } from 'src/user/profile-information/profile-information.service';

@Injectable()
export class ConversationService {
  constructor(
    @InjectRepository(Conversation)
    private readonly conRepo: Repository<Conversation>,
    private profileService: ProfileInformationService,
  ) {}

  async sendMessage(
    sender: ProfileInformation,
    sendMessageDto: SendMessageDto,
  ): Promise<any> {
    const receiver = await this.profileService.getProfilebyID(
      sendMessageDto.recipientId,
    );

    if (!receiver) {
      throw new HttpException('Invalid receipient', HttpStatus.BAD_REQUEST);
    }

    const conversation = await this.findOneByProfileIds({
      senderId: sender.id,
      receiverId: receiver.id,
    });

    const chats = [];

    const message = JSON.stringify({
      createdAt: new Date(),
      updatedAt: new Date(),
      id: DateHelpers.getTimestamp(new Date()),
      message: sendMessageDto.message,
      profile: sender,
    });

    if (!conversation) {
      chats.push(message);
      const newConversation = await this.conRepo.create({
        sender,
        senderId: sender.id,
        receiver,
        receiverId: receiver.id,
        chats,
      });
      await this.conRepo.save(newConversation);
      return this.getChats(chats);
    }

    chats.push(message, ...conversation.chats);

    this.conRepo.update(conversation.id, { chats });
    return this.getChats(chats);
  }

  private getChats(chats: any[]): IChat[] {
    return chats.map((msg) => JSON.parse(msg));
  }

  private parseChats(conversation: Conversation[]): any[] {
    return conversation.map(({ chats, ...con }) => ({
      ...con,
      chats: this.getChats(chats),
    }));
  }

  findOneByProfileIds(profileIds: {
    senderId: number;
    receiverId: number;
  }): Promise<Conversation> {
    return this.conRepo
      .createQueryBuilder('conversation')
      .where(`conversation.senderId = '${profileIds.senderId}'`)
      .andWhere(`conversation.receiverId = '${profileIds.receiverId}'`)
      .getOne();
  }

  async getMyConversations(
    sender: ProfileInformation,
  ): Promise<Conversation[]> {
    const conversation = await this.conRepo
      .createQueryBuilder('conversation')
      .where(`conversation.senderId = '${sender.id}'`)
      .orWhere(`conversation.receiverId = '${sender.id}'`)
      .getMany();
    return this.parseChats(conversation);
  }

  async findAll({
    limit = 0,
    fromDate,
    toDate,
    day,
    userId,
    sortBy,
    page = 1,
    orderBy,
    status,
    query,
    field,
    value,
    groupByDate,
    active,
    group,
    ...paginateDto
  }: PaginateDto): Promise<any> {
    try {
      const skippedItems = (page - 1) * limit;
      const order = {
        createdAt: orderBy || 'DESC',
      };
      let conversations: any[] = [];
      let totalCount = 0;

      const findOptions: FindManyOptions<Conversation> = {
        take: limit,
        skip: skippedItems,
        order,
      };
      const whereOptions: any = {};

      if (field && value) {
        whereOptions[field] = value;
      }
      findOptions.where = whereOptions;
      const [data, count] = await this.conRepo.findAndCount(findOptions);

      conversations = this.parseChats(data);
      totalCount = count;

      return {
        page,
        limit,
        totalCount,
        data: conversations,
      };
    } catch (error) {
      new HandleHttpExceptions({
        error,
        source: {
          service: Conversation.name,
          operator: this.findAll.name,
        },
        report: 'Error fetching conversations',
      });
    }
  }
}
