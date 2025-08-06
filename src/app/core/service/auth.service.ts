import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { environment as env } from '../../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient, private router: Router) {}

  get accessToken(): string | null {
    return localStorage.getItem('access_token');
  }

  get refreshTokenValue(): string | null {
    return localStorage.getItem('refresh_token');
  }

  saveTokens(access: string, refresh: string): void {
    localStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', refresh);
  }

  login(credentials: { email: string; password: string }) {
    return this.http.post<{ access_token: string; refresh_token: string }>(
      `${env.apiUrl}/auth/login`,
      credentials
    ).pipe(
      tap(response => {
        this.saveTokens(response.access_token, response.refresh_token);
      })
    );
  }

  register(data: { username: string; email: string; password: string }) {
    return this.http.post<{ access_token: string; refresh_token: string }>(
      `${env.apiUrl}/auth/register`,
      data
    ).pipe(
      tap(response => {
        console.log('Ответ сервера:', response);
        this.saveTokens(response.access_token, response.refresh_token);
      })
    );
  }


  refreshToken(): Observable<string> {
    const refreshToken = this.refreshTokenValue;
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    return this.http.post<{ access_token: string; refresh_token?: string }>(
      `${env.apiUrl}/auth/refresh`,
      { refresh_token: refreshToken }
    ).pipe(
      tap(response => {
        this.saveTokens(response.access_token, response.refresh_token ?? refreshToken);
      }),
      map(response => response.access_token) // возвращаем новый access_token
    );
  }

  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    this.router.navigate(['/login']).catch(() => {});
  }
}
