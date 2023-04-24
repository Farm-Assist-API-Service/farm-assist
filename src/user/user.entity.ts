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
import { ProfileInformation } from './profile-information/profile-information.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  readonly id: number;

  @Column()
  firstName: string;

  @Column({ nullable: true })
  middleName?: string;

  @Column()
  lastName: string;

  @Column({ nullable: true })
  phone: string;

  @Index({ unique: true })
  @Column()
  email: string;

  @Column({ nullable: true })
  emailAlias: string;

  @Exclude({ toPlainOnly: true })
  @Column()
  password: string;

  @OneToOne(() => ProfileInformation, {
    eager: true,
  })
  @JoinColumn()
  profileInformation: ProfileInformation;

  @Exclude({ toPlainOnly: true })
  @Column({ nullable: true })
  otp: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({
    type: 'enum',
    enum: UserRoles,
    default: UserRoles.USER,
  })
  role: UserRoles;

  @ManyToOne(() => Invite, {
    eager: true,
  })
  @JoinColumn()
  invite: Invite;

  @OneToMany(() => Invite, (invite) => invite.createdBy, {
    eager: false,
  })
  createdInvites: Invite[];

  @ManyToOne(() => Region, { nullable: true, eager: true })
  @JoinColumn()
  region: Region;

  @Column({ default: UserSource.DEV_ENV })
  source: UserSource;

  // @OneToOne(() => Kyc, (kyc) => kyc.user, {
  //   onDelete: 'SET NULL',
  //   nullable: true,
  //   eager: true,
  // })
  // @JoinColumn()
  // kyc: Kyc;

  @CreateDateColumn()
  readonly createdAt: Date;

  @UpdateDateColumn()
  readonly updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @VersionColumn()
  readonly version: number;
}
