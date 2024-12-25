import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../entities/product.entity';

@Injectable()
export class ProductRepository {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async create(product: Product): Promise<Product> {
    return this.productRepository.save(product);
  }

  async findById(id: string): Promise<Product> {
    return this.productRepository.findOne({ where: { id } });
  }

  async update(id: string, product: Partial<Product>): Promise<Product> {
    await this.productRepository.update(id, product);
    return this.findById(id);
  }

  async delete(id: string): Promise<void> {
    await this.productRepository.delete(id);
  }
}
