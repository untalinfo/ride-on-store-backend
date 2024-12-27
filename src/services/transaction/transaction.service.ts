import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { AxiosResponse } from 'axios';
import { firstValueFrom } from 'rxjs';
import * as crypto from 'crypto';

@Injectable()
export class TransactionService {
  private readonly api_url: string;
  private readonly api_public_key: string;
  private readonly api_private_key: string;
  private readonly integrity_key: string;
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.api_url = this.configService.get<string>('WOMPI_API_URL');
    this.api_public_key = this.configService.get<string>('WOMPI_PUBLIC_KEY');
    this.api_private_key = this.configService.get<string>('WOMPI_PRIVATE_KEY');
    this.integrity_key = this.configService.get<string>('WOMPI_INTEGRITY_KEY');
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

  async get_acceptance_tokens(): Promise<string> {
    const response: AxiosResponse = await firstValueFrom(
      this.httpService.get(`${this.api_url}merchants/${this.api_public_key}`),
    );
    return response.data.data.id;
  }
  async create_transaction_with_transaction({
    acceptance_token,
    amount_in_cents,
    currency,
    transaction_reference,
    customer_email,
    credit_card_token,
    installments,
  }: {
    acceptance_token: string;
    amount_in_cents: number;
    currency: string;
    customer_email: string;
    transaction_reference: string;
    credit_card_token: string;
    installments: number;
  }): Promise<string> {
    const signature = await this.generate_signature({
      transaction_reference,
      amount_in_cents,
      currency,
    });
    const response: AxiosResponse = await firstValueFrom(
      this.httpService.post(
        `${this.api_url}/transactions`,
        {
          acceptance_token,
          amount_in_cents,
          currency,
          customer_email,
          reference: transaction_reference,
          signature,
          payment_method: {
            type: 'CARD',
            token: credit_card_token,
            installments: installments,
          },
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.api_public_key}`,
          },
        },
      ),
    );
    return response.data;
  }
  async get_transaction(transaction_id: string): Promise<string> {
    const response: AxiosResponse = await firstValueFrom(
      this.httpService.get(`${this.api_url}transactions/${transaction_id}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.api_public_key}`,
        },
      }),
    );
    return response.data;
  }
}
