import {
  BaseEntity,
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  PrimaryColumn,
  UpdateDateColumn,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
  DeleteDateColumn,
} from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { ROLE, GENDER } from '../enums';
import { PASSWORD_HASH_SALT } from 'src/core/constants';

@Entity('users')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column({ default: false })
  verifiedByEmail: boolean;

  @Column({ default: null })
  otp: string;

  @Column({ default: false })
  banned: boolean;

  @Column()
  firstName: string;

  @Column()
  middleName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true, default: null })
  phone: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: GENDER,
    nullable: true,
    default: null,
  })
  gender: GENDER;

  @Column({
    type: 'enum',
    enum: ROLE,
    default: ROLE.USER,
  })
  role: ROLE;

  // @OneToMany(() => Farm, (farm) => wallet.owner)
  // @JoinColumn({ name: 'owner_name' })
  // farm: Farm[];

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  @DeleteDateColumn()
  deletedAt: Date;

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, PASSWORD_HASH_SALT);
  }

  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
}
