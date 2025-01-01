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

  async create(customer: Partial<Customer>): Promise<Customer> {
    return this.customerRepository.save(customer);
  }

  async findById(id: string): Promise<Customer> {
    return this.customerRepository.findOne({ where: { id } });
  }

  async findByEmail(email: string): Promise<Customer> {
    return this.customerRepository.findOne({ where: { email } });
  }

  async update(id: string, customer: Partial<Customer>): Promise<Customer> {
    await this.customerRepository.update(id, customer);
    return this.findById(id);
  }

  async delete(id: string): Promise<void> {
    await this.customerRepository.delete(id);
  }
}
