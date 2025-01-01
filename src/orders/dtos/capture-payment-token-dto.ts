import { IsString, IsUUID, IsNumber } from 'class-validator';
export class CapturePaymentTokenDto {
  @IsString()
  acceptance_token: string;
  @IsUUID()
  order_id: string;
  @IsString()
  payment_method_token: string;
  @IsNumber()
  installments: number;
}
