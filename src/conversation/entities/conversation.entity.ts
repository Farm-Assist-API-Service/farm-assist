import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToMany,
} from 'typeorm';
import { EConversationType } from '../enums/conversation-type';
import { ProfileInformation } from 'src/user/profile-information/entities/profile-information.entity';
import { IChat } from '../interfaces';

@Entity()
export class Conversation {
  @PrimaryGeneratedColumn()
  readonly id: number;

  @Column({
    type: 'enum',
    enum: EConversationType,
    default: EConversationType.PEER,
  })
  type: EConversationType;

  @ManyToOne((type) => ProfileInformation)
  sender: ProfileInformation;

  @ManyToOne((type) => ProfileInformation)
  recipient: ProfileInformation;

  @Column('text', { default: null, array: true })
  chats: string[];

  @CreateDateColumn()
  readonly createdAt: Date;

  @UpdateDateColumn()
  readonly updatedAt: Date;
}
