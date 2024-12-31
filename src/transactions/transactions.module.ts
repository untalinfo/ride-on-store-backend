import { Module } from '@nestjs/common';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import { RepositoryModule } from 'src/repositories/repository.module';
import { WompiModule } from 'src/services/wompi/wompi.module';

@Module({
  imports: [RepositoryModule, WompiModule],
  controllers: [TransactionsController],
  providers: [TransactionsService],
})
export class TransactionsModule {}
