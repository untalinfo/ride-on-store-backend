import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from '../entities/customer.entity';

@Injectable()
export class CustomerRepository {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
  ) {}

  async create(customer: Customer): Promise<Customer> {
    return this.customerRepository.save(customer);
  }

  async findById(id: string): Promise<Customer> {
    return this.customerRepository.findOne({ where: { id } });
  }

  async update(id: string, customer: Partial<Customer>): Promise<Customer> {
    await this.customerRepository.update(id, customer);
    return this.findById(id);
  }

  async delete(id: string): Promise<void> {
    await this.customerRepository.delete(id);
  }
}
