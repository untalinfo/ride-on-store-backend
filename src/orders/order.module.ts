import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { RepositoryModule } from '../repositories/repository.module';

@Module({
  imports: [RepositoryModule],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
