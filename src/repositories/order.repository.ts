import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../entities/order.entity';

@Injectable()
export class OrderRepository {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  async create(order: Partial<Order>): Promise<Order> {
    return this.orderRepository.create(order);
  }

  async save(order: Order): Promise<Order> {
    return this.orderRepository.save(order);
  }

  async findById(id: string): Promise<Order> {
    return this.orderRepository.findOne({
      where: { id },
      relations: ['customer'],
    });
  }

  async update(id: string, order: Partial<Order>): Promise<Order> {
    await this.orderRepository.update(id, order);
    return this.findById(id);
  }

  async delete(id: string): Promise<void> {
    await this.orderRepository.delete(id);
  }
}
