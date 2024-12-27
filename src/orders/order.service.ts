import { Injectable } from '@nestjs/common';
import { Order } from '../entities/order.entity';
import { CreateOrderDto } from './dtos/create-order-dtos';
import { CustomerRepository } from '../repositories/customer.repository';
import { OrderRepository } from '../repositories/order.repository';
import { ProductRepository } from '../repositories/product.repository';
import { OrderStatus } from '../entities/enums';
import { CreateCardTokenDto } from './dtos/create-card-token-dto';
import { Result } from 'src/interfaces/response.interface';
import { TransactionService } from 'src/services/transaction/transaction.service';

@Injectable()
export class OrderService {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly customerRepository: CustomerRepository,
    private readonly productRepository: ProductRepository,
    private readonly transactionService: TransactionService,
  ) {}

  async createOrder(createOrderDto: CreateOrderDto): Promise<Order> {
    const {
      customer_id,
      product_ids,
      shipping_addrs_line,
      shipping_address_city,
    } = createOrderDto;

    const customer = await this.customerRepository.findById(customer_id);
    if (!customer) {
      throw new Error('Customer not found');
    }

    const products = await this.productRepository.findByIds(product_ids);
    if (products.length !== product_ids.length) {
      throw new Error('One or more products not found');
    }

    const order = this.orderRepository.create({
      id: '0',
      customer,
      transactions: [],
      products,
      shipping_addrs_line,
      shipping_address_city,
      base_fee: '0',
      delivery_fee: '0',
      order_status: OrderStatus.CREATED,
      delivery_status: 'PENDING',
      total_amount: '0',
      created_at: new Date().toISOString(),
    });

    return order;
  }

  async getOrderById(id: string): Promise<Order> {
    return this.orderRepository.findById(id);
  }

  async createToken(
    createCardTokenDto: CreateCardTokenDto,
  ): Promise<Result<any>> {
    const result = {
      hasError: false,
      message: 'Token created successfully',
      data: {},
    };
    try {
      const response = await this.transactionService.tokenize_credit_card({
        number: createCardTokenDto.card_number,
        card_holder: createCardTokenDto.card_holder,
        cvc: createCardTokenDto.card_cvc,
        exp_month: createCardTokenDto.card_exp_month,
        exp_year: createCardTokenDto.card_exp_year,
      });
      result.data = response;
    } catch (error) {
      console.error('Error creating token', error);
      result.hasError = true;
      result.message = 'Error creating token';
    }
    return result;
  }
}
