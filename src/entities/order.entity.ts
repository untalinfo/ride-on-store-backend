import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Product } from './product.entity';
import { Transaction } from './transaction.entity';
import { Customer } from './customer.entity';
import { OrderDelliveryStatus } from './enums';

@Entity()
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToMany(() => Product, (product) => product.id)
  @JoinTable()
  products: Product[];

  @OneToMany(() => Transaction, (transaction) => transaction.order)
  transactions: Transaction[];

  @ManyToOne(() => Customer, (customer) => customer.orders)
  customer: Customer;

  @Column('int')
  base_fee_in_cents: number;

  @Column('int')
  delivery_fee_in_cents: number;

  @Column()
  shipping_addrs_line: string;

  @Column()
  shipping_address_city: string;

  @Column()
  order_status: string;

  @Column()
  delivery_status: OrderDelliveryStatus;

  @Column('int')
  total_amount_in_cents: number;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: string;
}
