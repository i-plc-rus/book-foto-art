import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import type { Observable } from 'rxjs';

import { BASE_API_URL } from '../app.config';
import type {
  IAuthLogin,
  IAuthLoginResponse,
  IAuthRefreshResponse,
  IAuthRegister,
} from '../interfaces/auth.interface';

/**
 * API- сервис для работы с аутентификацией
 */
@Injectable({
  providedIn: 'root',
})
export class AuthApiService {
  private readonly httpClient: HttpClient = inject(HttpClient);
  private readonly baseUrl: string = inject(BASE_API_URL);

  /**
   * Аутентификация
   * @param credentials логин и пароль
   */
  login(credentials: IAuthLogin): Observable<IAuthLoginResponse> {
    return this.httpClient.post<IAuthLoginResponse>(`${this.baseUrl}/auth/login`, credentials);
  }

  /**
   * Регистрация
   * @param data имя пользователя, email и пароль
   */
  register(data: IAuthRegister): Observable<IAuthLoginResponse> {
    return this.httpClient.post<IAuthLoginResponse>(`${this.baseUrl}/auth/register`, data);
  }

  /**
   * Refresh token
   * @param token
   */
  refreshToken(token: string): Observable<IAuthRefreshResponse> {
    return this.httpClient.post<IAuthRefreshResponse>(`${this.baseUrl}/auth/refresh`, {
      refresh_token: token,
    });
  }

  /**
   * Кнопка "Войти через Яндекс"
   */
  goYandexOauth(): Observable<string> {
    return this.httpClient.get<string>(`${this.baseUrl}/auth/yandex/login`);
  }

  /**
   * Обрабатывает ответ от Яндекса после успешной аутентификации
   * @param code Код авторизации от Яндекса
   * @param state State параметр для безопасности
   */
  yandexCallback(code: string, state: string): Observable<IAuthLoginResponse> {
    return this.httpClient.get<IAuthLoginResponse>(`${this.baseUrl}/auth/yandex/callback`, {
      params: { code, state },
    });
  }
}
