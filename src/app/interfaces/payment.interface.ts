export interface PaymentResult {
  payment_id: string;
  status: 'succeeded' | 'canceled' | 'failed' | 'pending';
}
