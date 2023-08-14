import { User } from 'src/user/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  UpdateDateColumn,
  VersionColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { ProfileInformation } from './profile-information.entity';

@Entity()
export class ProfileReview {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => ProfileInformation, (profile) => profile.id)
  @JoinColumn({ name: 'reviewById' })
  reviewBy: ProfileInformation;

  @Column({ nullable: true })
  reviewById!: number;

  @Column()
  title!: string;

  @Column()
  content!: string;

  @Column({ default: 0 })
  rating!: number;

  @ManyToOne(() => ProfileInformation, (profile) => profile.reviews, {
    onDelete: 'CASCADE',
    eager: true,
  })
  @JoinColumn({ name: 'profileId' })
  profile!: ProfileInformation;

  @CreateDateColumn()
  readonly createdAt: Date;

  @UpdateDateColumn()
  readonly updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @VersionColumn()
  readonly version: number;
}
