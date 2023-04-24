import {
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

import { Currency } from './currency.entity';
import { PaymentProviders } from 'src/payment/enums/payment-providers.enum';
import { WalletProviders } from 'src/payment/enums/wallet-providers.enum';

@Entity()
export class Region {
  @PrimaryGeneratedColumn()
  readonly id: number;

  @Column()
  name: string;

  @Column({
    type: 'enum',
    enum: PaymentProviders,
    default: PaymentProviders.PAYSTACK,
  })
  paymentProvider: PaymentProviders;

  @Column({
    type: 'enum',
    enum: WalletProviders,
    default: WalletProviders.VFD,
  })
  walletProvider: WalletProviders;

  @Column({ nullable: true })
  flagSvg: string;

  @Column({ nullable: true })
  flagPng: string;

  @Column('boolean', { default: true })
  isActive: boolean;

  @Column('boolean', { default: false, nullable: true })
  isDefault?: boolean;

  @Column({ nullable: true })
  code: string;

  @ManyToOne(() => Currency, {
    onDelete: 'SET NULL',
    nullable: true,
    eager: true,
  })
  @JoinColumn()
  currency: Currency;

  @Column({ nullable: true, default: 50 })
  newCardChargeAmount: number;

  @Column({ nullable: true })
  demonym: string;

  @CreateDateColumn()
  readonly createdAt: Date;

  @UpdateDateColumn()
  readonly updatedAt: Date;

  @VersionColumn()
  readonly version: number;
}
