import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Order } from './order.entity';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Order, (order) => order.transactions)
  order: Order;

  @Column()
  total_amount: string;

  @Column()
  created_at: string;

  @Column()
  status: string;

  @Column()
  payment_processor: string;

  @Column()
  psp_id: string;

  @Column('json')
  meta: Record<string, any>;
}
