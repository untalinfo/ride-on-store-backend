import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  Index,
  CreateDateColumn,
} from 'typeorm';
import { Order } from './order.entity';
import { IsEmail } from 'class-validator';

@Entity()
export class Customer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  full_name: string;

  @Column({ unique: true })
  @IsEmail()
  @Index()
  email: string;

  @Column()
  phone_number: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: string;

  @OneToMany(() => Order, (order) => order.customer)
  orders: Order[];
}
