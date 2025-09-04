import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import type { Observable } from 'rxjs';
import { catchError, of } from 'rxjs';

import { BASE_API_URL } from '../app.config';
import type { ExtendResponse, Plan, PromoCheckResponse } from '../interfaces/billing.interface';

/**
 * API-сервис для работы с оплатой
 */
@Injectable({
  providedIn: 'root',
})
export class BillingApiService {
  private readonly httpClient: HttpClient = inject(HttpClient);
  private readonly baseUrl: string = inject(BASE_API_URL);

  /** Создаёт платёж и возвращает ссылку на YooMoney */
  extendSubscription(plan: Plan): Observable<ExtendResponse> {
    const form = new FormData();
    form.append('plan', plan);
    return this.httpClient.post<ExtendResponse>(
      `${this.baseUrl}/profile/subscription/extend`,
      form,
    );
  }

  /**
   * Проверка промокода
   * Возвращаем {valid:false} при ошибке
   */
  checkPromo(code: string): Observable<PromoCheckResponse> {
    const form = new FormData();
    form.append('code', code);
    // ПРИ НУЖДЕ поменяй путь:
    return this.httpClient
      .post<PromoCheckResponse>(`${this.baseUrl}/profile/subscription/promo/check`, form)
      .pipe(catchError(() => of({ valid: false, message: 'Промокод не принят' })));
  }
}
