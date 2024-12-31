import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from '../entities/transaction.entity';

@Injectable()
export class TransactionRepository {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
  ) {}

  async create(transaction: Partial<Transaction>): Promise<Transaction> {
    return this.transactionRepository.create(transaction);
  }

  async save(transaction: Transaction): Promise<Transaction> {
    return this.transactionRepository.save(transaction);
  }

  async findById(id: string): Promise<Transaction> {
    return this.transactionRepository.findOne({ where: { id } });
  }

  async update(
    id: string,
    transaction: Partial<Transaction>,
  ): Promise<Transaction> {
    await this.transactionRepository.update(id, transaction);
    return this.findById(id);
  }

  async delete(id: string): Promise<void> {
    await this.transactionRepository.delete(id);
  }
}
