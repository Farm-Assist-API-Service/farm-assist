import { Exclude } from 'class-transformer';
import { Appointment } from 'src/appointment/entities/appointment.entity';
import { User } from 'src/user/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';
import { ProfileType } from '../enums/profile-information.enum';
import { EProfileStatus } from '../enums/profile-status.enum';
import { ProfileReview } from './profile-review.entity';

@Entity()
export class ProfileInformation {
  @PrimaryGeneratedColumn()
  readonly id: number;

  @Column({ nullable: true })
  name: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  phone: string;

  @Column({ default: ProfileType.REGULAR, enum: ProfileType })
  profileType: ProfileType;

  @Column({ nullable: true })
  fcmToken: string;

  @Column({ nullable: true })
  deviceId: string;

  @Exclude({ toPlainOnly: true })
  @Column({ nullable: true, type: 'varchar' })
  authBiometricPublicKey: string;

  @Column({ nullable: true })
  homeAddress: string;

  @Column({ nullable: true })
  state: string;

  @Column({ nullable: true })
  regionId: number;

  @Column({ nullable: true })
  workAddress: string;

  @ManyToOne(() => User, (user) => user.profileInformation, {
    eager: true,
  })
  user: User;

  @Column({ nullable: true })
  userId: number;

  @OneToMany(() => ProfileReview, (review) => review.profile, {
    onDelete: 'CASCADE',
  })
  reviews!: ProfileReview[];

  @Column({
    type: 'enum',
    enum: EProfileStatus,
    default: EProfileStatus.ACTIVE,
  })
  status: EProfileStatus;

  // @OneToMany(() => Appointment, (appointment) => appointment.host, {
  //   onDelete: 'CASCADE',
  //   // eager: true,
  // })
  // appointments!: Appointment[];

  @ManyToMany(() => Appointment, (appointment) => appointment.guests)
  appointments: Appointment[];

  @Column({
    default: false,
  })
  @Index()
  readonly isCompleted: boolean;

  @CreateDateColumn()
  readonly createdAt: Date;

  @UpdateDateColumn()
  readonly updatedAt: Date;

  @VersionColumn()
  readonly version: number;
}
