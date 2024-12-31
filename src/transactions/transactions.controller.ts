import { Controller, Get, Param } from '@nestjs/common';
import { TransactionsService } from './transactions.service';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}
  @Get(':id')
  async getTransaction(@Param('id') id: string) {
    return this.transactionsService.getTransactionById(id);
  }
}
