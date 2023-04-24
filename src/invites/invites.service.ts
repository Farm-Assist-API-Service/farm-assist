import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from 'src/config/config.service';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import { HandleHttpExceptions } from 'src/utils/helpers/handle-http-exceptions';
import { DeepPartial, Repository } from 'typeorm';
import { Invite } from './entities/invite.entity';

@Injectable()
export class InvitesService {
  constructor(
    @InjectRepository(Invite)
    private readonly inviteRepo: Repository<Invite>,
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {}

  async create(user: User): Promise<Invite> {
    try {
      const inviteData: DeepPartial<Invite> = {
        code: Math.floor(1000 + Math.random() * 90000000).toString(),
      };
      let invite = this.inviteRepo.create({ ...inviteData, createdBy: user });
      invite = await this.inviteRepo.save(invite);

      console.log(
        '🚀 ~ file: invites.service.ts:35 ~ InvitesService ~ create ~ invite',
        invite,
      );

      return invite;
    } catch (error) {
      new HandleHttpExceptions({
        error,
        source: {
          service: InvitesService.name,
          operator: this.create.name,
        },
        report: 'Failed to create invite',
      });
    }
  }

  async findOneById(id: number): Promise<Invite> {
    try {
      return await this.inviteRepo.findOne({
        where: { id },
        relations: ['createdBy'],
      });
    } catch (error) {
      new HandleHttpExceptions({
        error,
        source: {
          service: InvitesService.name,
          operator: this.findOneById.name,
        },
        report: 'Failed to find invite by id',
      });
    }
  }

  async findOneByCode(code: string): Promise<Invite> {
    try {
      return await this.inviteRepo.findOne({
        where: { code },
        relations: ['createdBy'],
      });
    } catch (error) {
      new HandleHttpExceptions({
        error,
        source: {
          service: InvitesService.name,
          operator: this.findOneByCode.name,
        },
        report: 'Failed to find invite by code',
      });
    }
  }

  async findAllUserInvites(user: User): Promise<Invite[]> {
    try {
      return await this.inviteRepo.find({
        where: { createdBy: user },
        relations: ['createdBy', 'usedBy'],
      });
    } catch (error) {
      new HandleHttpExceptions({
        error,
        source: {
          service: InvitesService.name,
          operator: this.findAllUserInvites.name,
        },
        report: 'Failed to fetch invites',
      });
    }
  }
}
