import { Exclude } from 'class-transformer';
import { UserRoles } from 'src/core/enums/roles.enum';
import { UserSource } from 'src/core/enums/sourceInfo';
import { Invite } from 'src/invites/entities/invite.entity';
import { Region } from 'src/region/entities/region.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';
import { User } from '../user.entity';

@Entity()
export class PasswordHistory {
  @PrimaryGeneratedColumn()
  readonly id: number;

  @Column()
  token: string;

  @Column({ default: true })
  valid: boolean;

  @ManyToOne(() => User)
  user: User;

  @CreateDateColumn()
  readonly createdAt: Date;

  @UpdateDateColumn()
  readonly updatedAt: Date;

  @VersionColumn()
  readonly version: number;
}
