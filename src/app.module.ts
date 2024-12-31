import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from './entities/customer.entity';
import { Product } from './entities/product.entity';
import { Order } from './entities/order.entity';
import { Transaction } from './entities/transaction.entity';
import { OrderModule } from './orders/order.module';
import { RepositoryModule } from './repositories/repository.module';
import { ProductModule } from './product/product.module';
import { TransactionModule } from './services/wompi/wompi.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
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
    TransactionModule,
    HttpModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
