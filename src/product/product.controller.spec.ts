import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { ProductRepository } from '../repositories/product.repository';

describe('ProductController', () => {
  let controller: ProductController;

  beforeEach(async () => {
    const productRepo: Partial<ProductRepository> = {
      findAll: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [
        ProductService,
        { provide: ProductRepository, useValue: productRepo },
      ],
    }).compile();

    controller = module.get<ProductController>(ProductController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
