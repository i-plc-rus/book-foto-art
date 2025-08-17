import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { BASE_API_URL } from '../app.config';

/**
 * Сервис для работы с коллекциями
 */
@Injectable({
  providedIn: 'root',
})
export class CollectionService {
  private readonly httpClient: HttpClient = inject(HttpClient);
  private readonly baseUrl: string = inject(BASE_API_URL);
}
