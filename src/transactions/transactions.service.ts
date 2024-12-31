import { Injectable } from '@nestjs/common';
import { WompiService } from './../services/wompi/wompi.service';
import { TransactionRepository } from 'src/repositories/transaction.repository';
import { Result } from 'src/interfaces/response.interface';

@Injectable()
export class TransactionsService {
  constructor(
    private readonly transactionRepository: TransactionRepository,
    private readonly wompiService: WompiService,
  ) {}
  async getTransactionById(id: string): Promise<Result<any>> {
    const result = {
      hasError: false,
      data: null,
      message: null,
    };
    const transaction = await this.transactionRepository.findById(id);
    if (!transaction) {
      result.hasError = true;
      result.message = 'Transaction not found';
    }

    result.data = transaction;
    return result;
  }
}
