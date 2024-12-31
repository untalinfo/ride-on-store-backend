import { TransactionRepository } from './../repositories/transaction.repository';
import { BASE_FEE_RATE } from './../constants/index';
import { Injectable } from '@nestjs/common';
import { Order } from '../entities/order.entity';
import { CreateOrderDto } from './dtos/create-order-dtos';
import { CustomerRepository } from '../repositories/customer.repository';
import { OrderRepository } from '../repositories/order.repository';
import { ProductRepository } from '../repositories/product.repository';
import { CreateCardTokenDto } from './dtos/create-card-token-dto';
import { Result } from 'src/interfaces/response.interface';
import { WompiService } from 'src/services/wompi/wompi.service';
import { Product } from 'src/entities/product.entity';
import { Customer } from 'src/entities/customer.entity';
import {
  OrderStatus,
  PaymentProcessor,
  TransactionStatus,
} from 'src/entities/enums';
import { DELIVERY_FEE_IN_CENTS } from 'src/constants';
import { CapturePaymentTokenDto } from './dtos/capture-payment-token-dto';
import { AppDataSource } from 'data-source';

@Injectable()
export class OrderService {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly customerRepository: CustomerRepository,
    private readonly productRepository: ProductRepository,
    private readonly TransactionRepository: TransactionRepository,
    private readonly wompiService: WompiService,
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

    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

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

      const savedOrder = await queryRunner.manager.save(order);

      // Decrease stock for each product
      for (const product of validate_products_result.data) {
        await queryRunner.manager.increment(
          Product,
          { id: product.id },
          'stock',
          -1,
        );
      }

      await queryRunner.commitTransaction();
      result.data.order = savedOrder;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error('Error creating order', error);
      result.hasError = true;
      result.message = 'Error creating order';
    } finally {
      await queryRunner.release();
    }

    return result;
  }

  async getOrderById(id: string): Promise<Order> {
    return this.orderRepository.findById(id);
  }

  async get_acceptance_token(): Promise<Result<any>> {
    const result = {
      hasError: false,
      message: 'Acceptance token created successfully',
      data: {},
    };

    try {
      const response = await this.wompiService.get_acceptance_tokens();
      result.data = response;
    } catch (error) {
      console.error('Error creating acceptance token', error);
      result.hasError = true;
      result.message = 'Error creating acceptance token';
    }

    return result;
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
      const response = await this.wompiService.tokenize_credit_card({
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

  async capturePayment({
    acceptance_token,
    order_id,
    payment_method_token,
    installments,
  }: CapturePaymentTokenDto): Promise<Result<any>> {
    let transaction;

    const result = {
      hasError: false,
      message: 'Payment captured successfully',
      data: {},
    };

    const validate_order_result = await this.validate_order(order_id);

    if (validate_order_result.hasError) {
      return validate_order_result;
    }

    const { data: order } = validate_order_result;

    try {
      transaction = await this.TransactionRepository.create({
        order: order,
        total_amount_in_cents: order.total_amount_in_cents,
        status: TransactionStatus.PENDING,
        payment_processor: PaymentProcessor.WOMPI,
      });

      await this.TransactionRepository.save(transaction);

      const wompiTransaction =
        await this.wompiService.create_transaction_with_credit_card_token({
          acceptance_token,
          transaction_reference: order_id,
          credit_card_token: payment_method_token,
          amount_in_cents: order.total_amount_in_cents,
          installments: installments,
          customer_email: order.customer.email,
          currency: 'COP',
        });

      order.order_status = OrderStatus.PROCESSING;
      transaction.external_transaction_id = wompiTransaction.id;

      Promise.all([
        await this.TransactionRepository.save(transaction),
        await this.orderRepository.save(order),
      ]);

      result.data = transaction;
    } catch (error) {
      console.error(
        'Error capturing payment',
        JSON.stringify(error.response.data),
      );
      if (transaction) {
        transaction.status = TransactionStatus.FAILED;
        this.TransactionRepository.save(transaction);
      }

      result.hasError = true;
      result.message = 'Error capturing payment';
    }

    return result;
  }

  private async validate_order(order_id: string): Promise<Result<Order>> {
    const order = await this.orderRepository.findById(order_id);
    if (!order) {
      return {
        hasError: true,
        message: 'Order not found',
        data: null,
      };
    }

    if (order.order_status !== OrderStatus.ACTIVE) {
      return {
        hasError: true,
        message: 'Order is in invalid state for payment (not active)',
        data: null,
      };
    }

    return {
      hasError: false,
      message: 'Order is valid',
      data: order,
    };
  }
}
