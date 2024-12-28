// src/controllers/order.controller.ts
import { Controller, Post, Body, Get } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dtos/create-order-dtos';
import { CreateCardTokenDto } from './dtos/create-card-token-dto';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async createOrder(@Body() createOrderDto: CreateOrderDto) {
    return this.orderService.createOrder(createOrderDto);
  }

  @Get(':id')
  async getOrderById(id: string) {
    return this.orderService.getOrderById(id);
  }

  @Post('token/cards')
  async createToken(@Body() createCardTokenDto: CreateCardTokenDto) {
    return this.orderService.createToken(createCardTokenDto);
  }

  @Get('token/acceptance')
  async get_acceptance_token() {
    return this.orderService.get_acceptance_token();
  }
}
