import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';

@Entity()
export class ProfileInformation {
  @PrimaryGeneratedColumn()
  readonly id: number;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  phone: string;

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
  workAddress: string;

  @Column({ nullable: true })
  bvn: string;

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
