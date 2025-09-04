export type Plan = 'month' | 'year';

export interface ExtendResponse {
  confirmation_url: string;
}

export interface PromoCheckResponse {
  valid: boolean;
  discount?: number; // например 10 означает -10%
  message?: string;
}
