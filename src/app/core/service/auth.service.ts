import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import type { Observable } from 'rxjs';
import { BehaviorSubject, catchError, finalize, of, throwError } from 'rxjs';
import { filter, map, switchMap, take, tap } from 'rxjs/operators';

import { AuthApiService } from '../../api/auth-api.service';
import type {
  IAuthLogin,
  IAuthLoginResponse,
  IAuthRegister,
} from '../../interfaces/auth.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly router: Router = inject(Router);
  private readonly authApiService: AuthApiService = inject(AuthApiService);
  private refreshTokenSubject = new BehaviorSubject<string | null>(null);
  private isRefreshing = false;

  get accessToken(): string | null {
    return localStorage.getItem('access_token');
  }

  get refreshTokenValue(): string | null {
    return localStorage.getItem('refresh_token');
  }

  saveTokens(access: string, refresh: string): void {
    try {
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
    } catch (e) {
      console.error('Token save failed', e);
    }
  }

  /**
   * Аутентификация
   * @param credentials логин и пароль
   */
  login(credentials: IAuthLogin): Observable<IAuthLoginResponse> {
    return this.authApiService.login(credentials).pipe(
      tap((response) => {
        this.saveTokens(response.access_token, response.refresh_token);
      }),
      catchError((error) => {
        console.error('Login failed:', error);
        return throwError(() => error);
      }),
    );
  }

  /**
   * Регистрация
   * @param data имя пользователя, email и пароль
   */
  register(data: IAuthRegister): Observable<IAuthLoginResponse> {
    return this.authApiService.register(data).pipe(
      tap((response) => {
        this.saveTokens(response.access_token, response.refresh_token);
      }),
    );
  }

  refreshToken(): Observable<string> {
    if (this.isRefreshing) {
      return this.refreshTokenSubject.pipe(
        filter((token) => token !== null),
        take(1),
        switchMap((token) => of(token!)),
      );
    }

    const refreshToken = this.refreshTokenValue;
    if (!refreshToken) {
      return throwError(() => new Error('No refresh token available'));
    }

    this.isRefreshing = true;
    this.refreshTokenSubject.next(null);

    return this.authApiService.refreshToken(refreshToken).pipe(
      tap((response) => {
        this.saveTokens(response.access_token, refreshToken);
        this.refreshTokenSubject.next(response.access_token);
      }),
      map((response) => response.access_token),
      catchError((err) => {
        this.refreshTokenSubject.next(null);
        this.logout();
        return throwError(() => err);
      }),
      finalize(() => {
        this.isRefreshing = false;
      }),
    );
  }

  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    this.router.navigate(['/login']).catch(() => {});
  }

  /**
   * Кнопка "Войти через Яндекс"
   */
  goYandexOauth(): Observable<string> {
    return this.authApiService.goYandexOauth();
  }

  /**
   * Обрабатывает ответ от Яндекса после успешной аутентификации
   */
  yandexCallback(code: string, state: string): Observable<IAuthLoginResponse> {
    return this.authApiService
      .yandexCallback(code, state)
      .pipe(tap((r) => this.saveTokens(r.access_token, r.refresh_token)));
  }
}
