import { IsString, IsArray, IsUUID, IsNotEmpty } from 'class-validator';

export class CreateOrderDto {
  @IsUUID()
  customer_id: string;

  @IsArray()
  @IsNotEmpty()
  product_ids: string[];

  @IsString()
  shipping_addrs_line: string;

  @IsString()
  shipping_address_city: string;
}
