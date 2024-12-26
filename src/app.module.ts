import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CustomerRepository } from './repositories/customer.repository';
import { ProductRepository } from './repositories/product.repository';
import { OrderRepository } from './repositories/order.repository';
import { TransactionRepository } from './repositories/transaction.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from './entities/customer.entity';
import { Product } from './entities/product.entity';
import { Order } from './entities/order.entity';
import { Transaction } from './entities/transaction.entity';
import { OrderModule } from './orders/order.module';
import { RepositoryModule } from './repositories/repository.module';
import { ProductModule } from './product/product.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'postgres',
      port: 5432,
      username: 'root',
      password: '12345',
      database: 'rideon',
      entities: [Customer, Product, Order, Transaction],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Customer, Product, Order, Transaction]),
    OrderModule,
    ProductModule,
    RepositoryModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    CustomerRepository,
    ProductRepository,
    OrderRepository,
    TransactionRepository,
  ],
})
export class AppModule {}
