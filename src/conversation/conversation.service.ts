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
    const recipient = await this.profileService.getProfilebyID(
      sendMessageDto.recipientId,
    );

    if (sender.id === recipient.id) {
      throw new HttpException(
        'Self messaging not allowed',
        HttpStatus.NOT_ACCEPTABLE,
      );
    }

    if (!recipient) {
      throw new HttpException('Invalid receipient', HttpStatus.BAD_REQUEST);
    }

    const conversation = await this.findOneByProfileIds({
      senderId: sender.id,
      recipientId: recipient.id,
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
        recipient,
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
    recipientId: number;
  }): Promise<Conversation> {
    return this.conRepo
      .createQueryBuilder('conversation')
      .where(`conversation.sender.id = '${profileIds.senderId}'`)
      .andWhere(`conversation.recipient.id = '${profileIds.recipientId}'`)
      .getOne();
  }

  async getMyConversations(
    sender: ProfileInformation,
  ): Promise<Conversation[]> {
    const conversation = await this.conRepo
      .createQueryBuilder('conversation')
      .leftJoinAndSelect('conversation.sender', 'sender')
      .leftJoinAndSelect('conversation.recipient', 'recipient')
      .where(`sender.id = '${sender.id}'`)
      .orWhere(`recipient.id = '${sender.id}'`)
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
