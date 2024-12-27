import { Test, TestingModule } from '@nestjs/testing';
import { OrderService } from './order.service';
import { CustomerRepository } from '../repositories/customer.repository';
import { ProductRepository } from '../repositories/product.repository';
import { OrderRepository } from '../repositories/order.repository';
import { CreateOrderDto } from './dtos/create-order-dtos';

describe('OrderService', () => {
  let service: OrderService;
  let customerRepo: Partial<CustomerRepository>;
  let productRepo: Partial<ProductRepository>;
  let orderRepo: Partial<OrderRepository>;

  beforeEach(async () => {
    customerRepo = {
      findById: jest.fn(),
    };
    productRepo = {
      findByIds: jest.fn(),
    };
    orderRepo = {
      create: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        { provide: CustomerRepository, useValue: customerRepo },
        { provide: ProductRepository, useValue: productRepo },
        { provide: OrderRepository, useValue: orderRepo },
      ],
    }).compile();

    service = module.get<OrderService>(OrderService);
  });

  it('should create an order successfully', async () => {
    customerRepo.findById = jest.fn().mockResolvedValue({ id: '123' });
    productRepo.findByIds = jest.fn().mockResolvedValue([{ id: 'p1' }]);
    orderRepo.create = jest.fn().mockReturnValue({ id: 'order123' });

    const dto: CreateOrderDto = {
      customer_id: '123',
      product_ids: ['p1'],
      shipping_addrs_line: '123 Main St',
      shipping_address_city: 'Test City',
    };

    const result = await service.createOrder(dto);
    expect(result.id).toBe('order123');
    expect(customerRepo.findById).toHaveBeenCalledWith('123');
    expect(productRepo.findByIds).toHaveBeenCalledWith(['p1']);
  });

  it('should throw error if customer is not found', async () => {
    customerRepo.findById = jest.fn().mockResolvedValue(null);
    const dto: CreateOrderDto = {
      customer_id: '999',
      product_ids: [],
      shipping_addrs_line: 'Some line',
      shipping_address_city: 'Some city',
    };
    await expect(() => service.createOrder(dto)).rejects.toThrow(
      'Customer not found',
    );
  });

  it('should throw error if any product is not found', async () => {
    customerRepo.findById = jest.fn().mockResolvedValue({ id: '123' });
    productRepo.findByIds = jest.fn().mockResolvedValue([{ id: 'p1' }]);
    const dto: CreateOrderDto = {
      customer_id: '123',
      product_ids: ['p1', 'p2'],
      shipping_addrs_line: 'Some line',
      shipping_address_city: 'Some city',
    };
    await expect(() => service.createOrder(dto)).rejects.toThrow(
      'One or more products not found',
    );
  });

  it('should get an order by id', async () => {
    orderRepo.findById = jest.fn().mockResolvedValue({ id: 'order123' });
    const result = await service.getOrderById('order123');
    expect(result.id).toBe('order123');
  });
});
