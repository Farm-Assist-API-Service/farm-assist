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
} from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { E_USER_ROLE, E_USER_GENDER } from 'src/core/schemas';
import { PASSWORD_HASH_SALT } from 'src/core/constants';

@Entity('users')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: false })
  isVerified: boolean;

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

  @Column({ unique: true })
  phone: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: E_USER_GENDER,
    nullable: true
  })
  gender: E_USER_GENDER;

  @Column({
    type: 'enum',
    enum: E_USER_ROLE,
    default: E_USER_ROLE.FARMER,
  })
  role: E_USER_ROLE;

  // @OneToMany(() => Farm, (farm) => wallet.owner)
  // @JoinColumn({ name: 'owner_name' })
  // farm: Farm[];

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, PASSWORD_HASH_SALT);
  }

  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
}
