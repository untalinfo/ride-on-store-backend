import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { RepositoryModule } from '../repositories/repository.module';
import { WompiModule } from 'src/services/wompi/wompi.module';

@Module({
  imports: [RepositoryModule, WompiModule],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
