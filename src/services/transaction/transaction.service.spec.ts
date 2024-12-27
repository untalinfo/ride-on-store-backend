import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { TransactionService } from './transaction.service';
import { of } from 'rxjs';
import * as crypto from 'crypto';
import { AxiosRequestHeaders, AxiosResponse } from 'axios';

describe('TransactionService', () => {
  let service: TransactionService;
  let httpService: HttpService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionService,
        {
          provide: HttpService,
          useValue: {
            post: jest.fn(),
            get: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              switch (key) {
                case 'WOMPI_API_URL':
                  return 'https://sandbox.wompi.co/v1';
                case 'WOMPI_PUBLIC_KEY':
                  return 'public-key';
                case 'WOMPI_INTEGRITY_KEY':
                  return 'integrity-key';
                default:
                  return null;
              }
            }),
          },
        },
      ],
    }).compile();

    service = module.get<TransactionService>(TransactionService);
    httpService = module.get<HttpService>(HttpService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generate_signature', () => {
    it('should generate a valid SHA-256 signature', async () => {
      const transaction_reference = 'ref123';
      const amount_in_cents = 1000;
      const currency = 'COP';
      const expectedSignature = crypto
        .createHash('sha256')
        .update(
          `${transaction_reference}${amount_in_cents}${currency}integrity-key`,
        )
        .digest('hex');
      const signature = await service['generate_signature']({
        transaction_reference,
        amount_in_cents,
        currency,
      });
      expect(signature).toBe(expectedSignature);
    });
  });
  describe('createTransaction', () => {
    it('should create a transaction and return the response data', async () => {
      const transactionDetails = {
        acceptance_token: 'acceptance-token',
        amount_in_cents: 1000,
        currency: 'COP',
        customer_email: 'test@example.com',
        installments: 1,
        transaction_reference: 'transaction-1234',
        credit_card_token: 'credit-card-token',
      };
      const mockAxiosResponse: AxiosResponse = {
        status: 200,
        statusText: 'OK',
        config: {
          headers: {} as AxiosRequestHeaders,
        },
        headers: {} as AxiosRequestHeaders,
        data: {},
      };
      jest.spyOn(httpService, 'post').mockReturnValue(of(mockAxiosResponse));
      const response =
        await service.create_transaction_with_credit_card_token(
          transactionDetails,
        );
      expect(response).toEqual(mockAxiosResponse.data);
      expect(httpService.post).toHaveBeenCalledWith(
        'https://sandbox.wompi.co/v1/transactions',
        {
          reference: transactionDetails.transaction_reference,
          acceptance_token: transactionDetails.acceptance_token,
          currency: transactionDetails.currency,
          amount_in_cents: transactionDetails.amount_in_cents,
          customer_email: transactionDetails.customer_email,
          signature: expect.any(String),
          payment_method: {
            type: 'CARD',
            token: transactionDetails.credit_card_token,
            installments: transactionDetails.installments,
          },
        },
        {
          headers: {
            Authorization: `Bearer public-key`,
            'Content-Type': 'application/json',
          },
        },
      );
    });
  });
});
