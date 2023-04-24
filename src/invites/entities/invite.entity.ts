import { User } from 'src/user/user.entity';
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
} from 'typeorm';

import { InviteStatus } from '../enums/invite-status.enum';

@Entity()
export class Invite {
  @PrimaryGeneratedColumn()
  readonly id: number;

  @Column('varchar')
  code: string;

  @Column({
    type: 'enum',
    enum: InviteStatus,
    default: InviteStatus.PENDING,
  })
  status: InviteStatus;

  @ManyToOne(() => User, (user) => user.createdInvites, { eager: false })
  createdBy: User;

  @OneToMany(() => User, (user) => user.invite, { eager: false })
  usedBy: User[];

  // @Column('date', { nullable: true })
  // usageDate: Date;

  @Column('boolean', { default: false })
  isUniversal: boolean;

  @CreateDateColumn()
  readonly createdAt: Date;

  @UpdateDateColumn()
  readonly updatedAt: Date;
}
