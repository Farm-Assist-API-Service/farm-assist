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

  @ManyToMany(() => ProfileInformation, (profile) => profile, {
    // eager: false,
  })
  sender: ProfileInformation;

  @Column({ default: null })
  senderId: number;

  @ManyToMany(() => ProfileInformation, (profile) => profile, {
    // eager: false,
  })
  receiver: ProfileInformation;

  @Column({ default: null })
  receiverId: number;

  @Column('text', { default: null, array: true })
  chats: string[];

  @CreateDateColumn()
  readonly createdAt: Date;

  @UpdateDateColumn()
  readonly updatedAt: Date;
}
