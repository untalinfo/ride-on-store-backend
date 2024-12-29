import { DataSource } from 'typeorm';
import { Customer } from './src/entities/customer.entity';
import { Product } from './src/entities/product.entity';
import { Order } from './src/entities/order.entity';
import { Transaction } from './src/entities/transaction.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'postgres',
  port: 5432,
  username: 'root',
  password: '12345',
  database: 'rideon',
  entities: [Customer, Product, Order, Transaction],
  migrations: ['dist/src/migrations/*.js'],
  synchronize: false,
});
