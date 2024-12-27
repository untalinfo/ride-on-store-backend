import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { RepositoryModule } from '../repositories/repository.module';

@Module({
  imports: [RepositoryModule],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
