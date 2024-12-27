import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './product.service';
import { ProductRepository } from '../repositories/product.repository';

describe('ProductService', () => {
  let service: ProductService;
  let productRepo: Partial<ProductRepository>;

  beforeEach(async () => {
    productRepo = {
      findAll: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [
        ProductService,
        { provide: ProductRepository, useValue: productRepo },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return all products', async () => {
    const products = [
      { id: '1', name: 'Product 1' },
      { id: '2', name: 'Product 2' },
    ];
    productRepo.findAll = jest.fn().mockResolvedValue(products);
    expect(await service.findAll()).toBe(products);
  });
});
