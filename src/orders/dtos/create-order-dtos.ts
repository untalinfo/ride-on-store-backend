import { IsString, IsArray, IsNotEmpty } from 'class-validator';

export class CreateOrderDto {
  @IsString()
  customer_email: string;
  @IsString()
  customer_phone_number: string;
  @IsString()
  customer_full_name: string;

  @IsArray()
  @IsNotEmpty()
  product_ids: string[];

  @IsString()
  shipping_addrs_line: string;

  @IsString()
  shipping_address_city: string;
}
