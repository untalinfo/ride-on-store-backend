import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from 'src/entities/customer.entity';
import { Order } from 'src/entities/order.entity';
import { Product } from 'src/entities/product.entity';
import { Transaction } from 'src/entities/transaction.entity';
import { OrderRepository } from './order.repository';
import { CustomerRepository } from './customer.repository';
import { ProductRepository } from './product.repository';
import { TransactionRepository } from './transaction.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Order, Customer, Product, Transaction])],
  providers: [
    OrderRepository,
    CustomerRepository,
    ProductRepository,
    TransactionRepository,
  ],
  exports: [
    OrderRepository,
    CustomerRepository,
    ProductRepository,
    TransactionRepository,
  ],
})
export class RepositoryModule {}
