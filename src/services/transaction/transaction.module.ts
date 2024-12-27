import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TransactionService } from './transaction.service';

@Module({
  imports: [HttpModule],
  providers: [TransactionService],
  exports: [TransactionService],
})
export class TransactionModule {}
