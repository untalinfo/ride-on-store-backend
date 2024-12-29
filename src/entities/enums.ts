export enum OrderStatus {
  ACTIVE = 'ACTIVE',
  PROCESSING = 'PROCESSING',
  EXPIRED = 'EXPIRED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export enum TransactionStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
}

export enum PaymentProcessor {
  WOMPI = 'WOMPI',
  STRIPE = 'STRIPE',
  PAYPAL = 'PAYPAL',
}
