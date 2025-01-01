import { Test, TestingModule } from '@nestjs/testing';
import { OrderService } from './order.service';
import { Customer } from './../entities/customer.entity';
import { Product } from './../entities/product.entity';
import { AppDataSource } from './../../data-source';
import { CustomerRepository } from 'src/repositories/customer.repository';
import { ProductRepository } from 'src/repositories/product.repository';
import { RepositoryModule } from 'src/repositories/repository.module';
import { WompiModule } from 'src/services/wompi/wompi.module';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Transaction } from 'src/entities/transaction.entity';
import { Order } from 'src/entities/order.entity';
import { TransactionsModule } from 'src/transactions/transactions.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

describe('OrderService', () => {
  let service: OrderService;
  let customerRepository: Partial<CustomerRepository>;
  let productRepository: ProductRepository;
  let queryRunner: any;

  beforeEach(async () => {
    customerRepository = {
      findByEmail: jest.fn(),
      create: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
        }),
        RepositoryModule,
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: 'postgres',
          port: 5432,
          username: 'root',
          password: '12345',
          database: 'wompi',
          entities: [Customer, Product, Order, Transaction],
          synchronize: true,
        }),
        WompiModule,
        TransactionsModule,
      ],
      providers: [OrderService, ConfigService],
    }).compile();

    service = module.get<OrderService>(OrderService);
    customerRepository = module.get<CustomerRepository>(CustomerRepository);
    productRepository = module.get<ProductRepository>(ProductRepository);

    queryRunner = {
      manager: {
        save: jest.fn(),
        increment: jest.fn(),
      },
      connect: jest.fn(),
      startTransaction: jest.fn(),
      commitTransaction: jest.fn(),
      rollbackTransaction: jest.fn(),
      release: jest.fn(),
    };

    jest.spyOn(AppDataSource, 'createQueryRunner').mockReturnValue(queryRunner);
  });

  it('should create an order', async () => {
    const createOrderDto = {
      customer_email: 'test@example.com',
      customer_full_name: 'Test User',
      customer_phone_number: '32177651231',
      product_ids: ['product1', 'product2'],
      shipping_addrs_line: 'Calle 26 100 10',
      shipping_address_city: 'Cali',
    };

    const mockCustomer = {
      id: 'customer1',
      email: 'test@example.com',
      full_name: 'Test User',
    } as Customer;
    const mockProducts = [
      {
        id: 'product1',
        price: 1000,
        stock: 10,
        title: 'Product 1',
        image: 'product1.jpg',
        description: 'Product 1 description',
        created_at: new Date(),
      },
      {
        id: 'product2',
        price: 2000,
        stock: 20,
        title: 'Product 2',
        image: 'product2.jpg',
        description: 'Product 2 description',
        created_at: new Date(),
      },
    ];

    jest
      .spyOn(customerRepository, 'findByEmail')
      .mockResolvedValue(mockCustomer);
    jest.spyOn(productRepository, 'findByIds').mockResolvedValue(mockProducts);
    jest.spyOn(queryRunner.manager, 'save').mockResolvedValue({
      id: 'order1',
      customer: mockCustomer,
      products: mockProducts,
    } as any);

    const result = await service.createOrder(createOrderDto);

    expect(queryRunner.manager.save).toHaveBeenCalled();

    expect(queryRunner.manager.increment).toHaveBeenCalledWith(
      Product,
      { id: 'product1' },
      'stock',
      -1,
    );
    expect(queryRunner.manager.increment).toHaveBeenCalledWith(
      Product,
      { id: 'product2' },
      'stock',
      -1,
    );

    expect(result).toEqual({
      hasError: false,
      message: 'Order created successfully',
      data: expect.objectContaining({ id: 'order1' }),
    });
  });
});
