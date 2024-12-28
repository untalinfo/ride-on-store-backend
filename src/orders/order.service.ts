import { Injectable } from '@nestjs/common';
import { Order } from '../entities/order.entity';
import { CreateOrderDto } from './dtos/create-order-dto';
import { CustomerRepository } from '../repositories/customer.repository';
import { OrderRepository } from '../repositories/order.repository';
import { ProductRepository } from '../repositories/product.repository';
import { CreateCardTokenDto } from './dtos/create-card-token-dto';
import { Result } from 'src/interfaces/response.interface';
import { TransactionService } from 'src/services/transaction/transaction.service';

@Injectable()
export class OrderService {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly customerRepository: CustomerRepository,
    private readonly productRepository: ProductRepository,
    private readonly TransactionService: TransactionService,
  ) {}

  async createOrder(createOrderDto: CreateOrderDto): Promise<Result<any>> {
    const result = {
      hasError: false,
      message: 'Token created successfully',
      data: {},
    };

    const validate_customer_result = await this.validate_customer(
      createOrderDto.customer_email,
      createOrderDto.customer_full_name,
      createOrderDto.customer_phone_number,
    );

    // const validate_product_stock_result = validate_product_stock(
    //   createOrderDto.product_ids,
    // );

    // const {
    //   customer_email,
    //   customer_phone_number,
    //   customre_full_name,
    //   product_ids,
    //   shipping_addrs_line,
    //   shipping_address_city,
    // } = createOrderDto;

    // const order = this.orderRepository.create({
    //   id: '0',
    //   customer,
    //   transactions: [],
    //   products,
    //   shipping_addrs_line,
    //   shipping_address_city,
    //   base_fee: '0',
    //   delivery_fee: '0',
    //   order_status: OrderStatus.CREATED,
    //   delivery_status: 'PENDING',
    //   total_amount: '0',
    //   created_at: new Date().toISOString(),
    // });

    return result;
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
      const response = await this.TransactionService.tokenize_credit_card({
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
  private async validate_customer(
    email: string,
    full_name: string,
    phone_number: string,
  ): Promise<
    Result<{
      customer_id?: string;
    }>
  > {
    const result: Result<{
      customer_id?: string;
    }> = {
      hasError: false,
      message: '',
      data: {},
    };
    let customer = await this.customerRepository.findByEmail(email);
    if (customer) {
      result.data.customer_id = customer.id;
      return result;
    } else {
      customer = await this.customerRepository.create({
        email,
        full_name,
        phone_number,
      });

      result.data.customer_id = customer.id;
      return result;
    }
  }

  async validate_products(product_ids: string[]): Promise<Result<Product[]>> {
    const products = await this.productRepository.findByIds(product_ids);
    if (products.length !== product_ids.length) {
      return {
        hasError: true,
        message: 'One or more products not found',
        data: [],
      };
    }

    for (const product of products) {
      if (product.stock < 1) {
        return {
          hasError: true,
          message: `Product ${product.id} does not have enough stock`,
          data: [],
        };
      }
    }

    return {
      hasError: false,
      message: 'Products are valid',
      data: products,
    };
  }
  // Call Wompi API to create a token
}
