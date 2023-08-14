import { InjectRepository } from '@nestjs/typeorm';
import { Exclude } from 'class-transformer';
import { ELocation } from 'src/core/enums/location.enum';
import { EUnitOfTime } from 'src/core/enums/unit-of-time.enum ';
import { ProfileInformation } from 'src/user/profile-information/entities/profile-information.entity';
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';
import { EAppointmentStatus } from '../enums/appointment-status.enum';

@Entity()
export class Appointment {
  @PrimaryGeneratedColumn()
  readonly id: number;

  @Column()
  title!: string;

  @Column({ nullable: true })
  description: string;

  @OneToMany(() => ProfileInformation, (profile) => profile)
  guests!: ProfileInformation[];

  @Column({ default: 1 })
  duration!: number;

  @Column({
    enum: EAppointmentStatus,
    type: 'enum',
    default: EAppointmentStatus.ACTIVE,
  })
  status!: EAppointmentStatus;

  @Column({ enum: EUnitOfTime, type: 'enum', default: EUnitOfTime.MINUTES })
  unitOfTime!: EUnitOfTime;

  @Column({ enum: ELocation, type: 'enum' })
  location: ELocation;

  @ManyToOne(() => ProfileInformation, (profile) => profile.id, { eager: true })
  @JoinColumn()
  host: ProfileInformation; // This could be a consultee(s) (Farmer(s)) - Consultant

  @Column()
  readonly date: Date;

  @Column()
  startAt: Date;

  @Column()
  endAt: Date;

  @BeforeInsert()
  async setAppointment() {
    this.startAt = this.date;
    this.endAt = this.date;
    // use time to determine startAt
    // use duration and time to determine endAt
    // const time = `${this.unitOfTime}`; // 2hrs 29mins
  }

  @CreateDateColumn()
  readonly createdAt: Date;

  @UpdateDateColumn()
  readonly updatedAt: Date;

  @VersionColumn()
  readonly version: number;
}
