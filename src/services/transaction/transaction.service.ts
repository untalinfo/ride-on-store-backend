import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { AxiosResponse } from 'axios';
import { firstValueFrom } from 'rxjs';
import * as crypto from 'crypto';

@Injectable()
export class TransactionService {
  private readonly api_url: string;
  private readonly api_key: string;
  private readonly integrity_key: string;
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.api_url = this.configService.get<string>('WOMPI_API_URL');
    this.api_key = this.configService.get<string>('WOMPI_PUBLIC_KEY');
    this.integrity_key = this.configService.get<string>('WOMPI_INTEGRITY_KEY');
  }

  async get_acceptance_tokens(): Promise<string> {
    const response: AxiosResponse = await firstValueFrom(
      this.httpService.get(`${this.api_url}merchants/${this.api_key}`),
    );
    return response.data.data.id;
  }

  //<Referencia><Monto><Moneda><SecretoIntegridad>"
  async generate_signature({
    transaction_reference,
    amount_in_cents,
    currency,
  }: {
    transaction_reference: string;
    amount_in_cents: number;
    currency: string;
  }): Promise<string> {
    const data = `${transaction_reference}${amount_in_cents}${currency}${this.integrity_key}`;
    return crypto.createHash('sha256').update(data).digest('hex');
  }

  async tokenize_credit_card({
    card_number,
    card_holder,
    card_expiration_date,
    card_cvv,
  }: {
    card_number: string;
    card_holder: string;
    card_expiration_date: string;
    card_cvv: string;
  }): Promise<string> {
    const response: AxiosResponse = await firstValueFrom(
      this.httpService.post(`${this.api_url}tokens/cards`, {
        number: card_number,
        card_holder,
        expiration_date: card_expiration_date,
        cvv: card_cvv,
      }),
    );
    return response.data.data.id;
  }
}
