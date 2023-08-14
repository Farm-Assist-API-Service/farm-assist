import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';
import { ENotificationEvent } from '../enums/notification-event.enum';

@Entity()
export class Notification {
  @PrimaryGeneratedColumn()
  readonly id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  location: string;

  @Column({ nullable: true })
  description: string;

  @Column()
  startAt: Date;

  @Column()
  endAt: Date;

  @Column({ enum: ENotificationEvent, type: 'enum' })
  eventType: ENotificationEvent;

  @CreateDateColumn()
  readonly createdAt: Date;

  @UpdateDateColumn()
  readonly updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @VersionColumn()
  readonly version: number;
}
