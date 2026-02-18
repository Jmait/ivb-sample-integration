import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../user/user.entity';

export enum TransactionStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
}

export enum TransactionType {
  FIAT_COLLECTION = 'FIAT_COLLECTION',
  CRYPTO_COLLECTION = 'CRYPTO_COLLECTION',
  FIAT_PAYOUT = 'FIAT_PAYOUT',
  CRYPTO_PAYOUT = 'CRYPTO_PAYOUT',
}

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  reference: string;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  amount: number;

  @Column({ type: 'enum', enum: TransactionType })
  type: TransactionType;

  @Column({ type: 'enum', enum: TransactionStatus, default: TransactionStatus.PENDING })
  status: TransactionStatus;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  token: string;

  @Column({ nullable: true })
  chain: string;

  @Column({ type: 'decimal', precision: 18, scale: 8, nullable: true })
  settledAmountInCrypto: number;

  @Column({ nullable: true })
  failureReason: string;

  @ManyToOne(() => User)
  user: User;

  @Column()
  userId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
