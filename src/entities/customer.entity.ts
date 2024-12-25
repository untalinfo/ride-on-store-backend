import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Order } from './order.entity';

@Entity()
export class Customer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  full_name: string;

  @Column()
  email: string;

  @Column()
  phone_number: string;

  @Column()
  created_at: string;

  @OneToMany(() => Order, (order) => order.customer)
  orders: Order[];
}
