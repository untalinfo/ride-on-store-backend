import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { RepositoryModule } from '../repositories/repository.module';
import { TransactionModule } from 'src/services/transaction/transaction.module';

@Module({
  imports: [RepositoryModule, TransactionModule],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
