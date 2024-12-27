import { IsString } from 'class-validator';
export class CreateCardTokenDto {
  @IsString()
  card_number: string;
  @IsString()
  card_exp_month: string;
  @IsString()
  card_exp_year: string;
  @IsString()
  card_cvc: string;
}
