import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import type { Observable } from 'rxjs';

import { BASE_API_URL } from '../app.config';
import type { PaymentResult } from '../interfaces/payment.interface';

@Injectable({
  providedIn: 'root',
})
export class SubscriptionApiService {
  private readonly httpClient = inject(HttpClient);
  private readonly baseUrl: string = inject(BASE_API_URL);

  /**
   * Получить инфо о результате платежа
   * @param paymentId
   */
  getPaymentResult(paymentId: string): Observable<PaymentResult> {
    // эндпоинт, который описал бек:
    // GET /subscription/result/:payment_id
    return this.httpClient.get<PaymentResult>(`${this.baseUrl}/subscription/result/${paymentId}`);
  }
}
