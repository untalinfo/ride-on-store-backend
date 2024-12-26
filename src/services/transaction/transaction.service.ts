import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class TransactionService {
  constructor(private readonly httpService: HttpService) {}
}
