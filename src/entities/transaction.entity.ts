import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Order } from './order.entity';
import { PaymentProcessor, TransactionStatus } from './enums';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Order, (order) => order.transactions)
  order: Order;

  @Column({ unique: true, nullable: true })
  external_transaction_id: string;

  @Column('int')
  total_amount_in_cents: number;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: string;

  @Column()
  status: TransactionStatus;

  @Column()
  payment_processor: PaymentProcessor;

  @Column('json')
  meta: Record<string, any>;
}
