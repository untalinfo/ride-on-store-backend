import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Product } from './product.entity';
import { Transaction } from './transaction.entity';
import { Customer } from './customer.entity';

@Entity()
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToMany(() => Product, (product) => product.id)
  products: Product[];

  @OneToMany(() => Transaction, (transaction) => transaction.order)
  transactions: Transaction[];

  @ManyToOne(() => Customer, (customer) => customer.orders)
  customer: Customer;

  @Column()
  base_fee: string;

  @Column()
  delivery_fee: string;

  @Column()
  shipping_addrs_line: string;

  @Column()
  shipping_address_city: string;

  @Column()
  order_status: string;

  @Column()
  delivery_status: string;

  @Column()
  total_amount: string;

  @Column()
  created_at: string;
}
