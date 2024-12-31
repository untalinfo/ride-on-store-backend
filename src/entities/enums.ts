export enum OrderStatus {
  ACTIVE = 'ACTIVE',
  PROCESSING = 'PROCESSING',
  EXPIRED = 'EXPIRED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export enum OrderDelliveryStatus {
  PENDING = 'PENDING',
  DISPATCHED = 'DISPATCHED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}

export enum TransactionStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
  DECLINED = 'DECLINED',
}

export enum PaymentProcessor {
  WOMPI = 'WOMPI',
  STRIPE = 'STRIPE',
  PAYPAL = 'PAYPAL',
}
