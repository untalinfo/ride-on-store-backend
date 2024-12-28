import { BASE_FEE_RATE } from './../constants/index';
import { Injectable } from '@nestjs/common';
import { Order } from '../entities/order.entity';
import { CreateOrderDto } from './dtos/create-order-dtos';
import { CustomerRepository } from '../repositories/customer.repository';
import { OrderRepository } from '../repositories/order.repository';
import { ProductRepository } from '../repositories/product.repository';
import { CreateCardTokenDto } from './dtos/create-card-token-dto';
import { Result } from 'src/interfaces/response.interface';
import { TransactionService } from 'src/services/transaction/transaction.service';
import { Product } from 'src/entities/product.entity';
import { Customer } from 'src/entities/customer.entity';
import { OrderStatus } from 'src/entities/enums';
import { DELIVERY_FEE_IN_CENTS } from 'src/constants';

@Injectable()
export class OrderService {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly customerRepository: CustomerRepository,
    private readonly productRepository: ProductRepository,
    private readonly TransactionService: TransactionService,
  ) {}

  async createOrder(createOrderDto: CreateOrderDto): Promise<Result<any>> {
    const result: Result<any> = {
      hasError: false,
      message: 'Token created successfully',
      data: {},
    };

    const validate_customer_result = await this.validate_customer(
      createOrderDto.customer_email,
      createOrderDto.customer_full_name,
      createOrderDto.customer_phone_number,
    );

    if (validate_customer_result.hasError) {
      return validate_customer_result;
    }

    const validate_products_result = await this.validate_products(
      createOrderDto.product_ids,
    );

    if (validate_products_result.hasError) {
      return validate_products_result;
    }

    const calculate_order_amounts_result = this.calculate_order_amounts(
      validate_products_result.data,
    );

    const { shipping_addrs_line, shipping_address_city } = createOrderDto;

    try {
      const order = await this.orderRepository.create({
        customer: validate_customer_result.data.customer,
        products: validate_products_result.data,
        shipping_addrs_line,
        shipping_address_city,
        base_fee_in_cents:
          calculate_order_amounts_result.data.base_fee_in_cents,
        delivery_fee_in_cents:
          calculate_order_amounts_result.data.delivery_fee_in_cents,
        order_status: OrderStatus.ACTIVE,
        delivery_status: 'PENDING',
        total_amount_in_cents:
          calculate_order_amounts_result.data.total_order_in_cents,
      });

      result.data.order = order;
    } catch (error) {
      result.hasError = true;
      result.message = 'Error creating order';
    }

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
      customer?: Customer;
    }>
  > {
    const result: Result<{
      customer?: Customer;
    }> = {
      hasError: false,
      message: '',
      data: {},
    };
    let customer = await this.customerRepository.findByEmail(email);
    if (customer) {
      result.data.customer = customer;
      return result;
    } else {
      customer = await this.customerRepository.create({
        email,
        full_name,
        phone_number,
      });

      result.data.customer = customer;
      return result;
    }
  }

  private async validate_products(
    product_ids: string[],
  ): Promise<Result<Product[]>> {
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

  private calculate_order_amounts(products: Product[]): Result<{
    total_in_products_in_cents: number;
    base_fee_in_cents: number;
    delivery_fee_in_cents: number;
    total_order_in_cents: number;
  }> {
    let total_in_products_in_cents = 0;
    let base_fee_in_cents = 0;
    const delivery_fee_in_cents = DELIVERY_FEE_IN_CENTS;

    for (const product of products) {
      total_in_products_in_cents += product.price;
    }

    base_fee_in_cents = total_in_products_in_cents * BASE_FEE_RATE;

    return {
      hasError: false,
      message: '',
      data: {
        total_in_products_in_cents,
        base_fee_in_cents,
        delivery_fee_in_cents,
        total_order_in_cents:
          total_in_products_in_cents +
          base_fee_in_cents +
          delivery_fee_in_cents,
      },
    };
  }
}
