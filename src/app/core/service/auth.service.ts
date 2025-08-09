import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap, map, switchMap, filter, take } from 'rxjs/operators';
import {Observable, BehaviorSubject, of, throwError, catchError, finalize} from 'rxjs';
import { Router } from '@angular/router';
import { environment as env } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isRefreshing = false;
  private refreshTokenSubject = new BehaviorSubject<string | null>(null);

  constructor(private http: HttpClient, private router: Router) {}

  get accessToken(): string | null {
    return localStorage.getItem('access_token');
  }

  get refreshTokenValue(): string | null {
    return localStorage.getItem('refresh_token');
  }

  saveTokens(access: string, refresh: string) {
    try {
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
    } catch (e) {
      console.error('Token save failed', e);
    }
  }

  login(credentials: { email: string; password: string }) {
    return this.http.post<{ access_token: string; refresh_token: string }>(
        `${env.apiUrl}/auth/login`,
        credentials
    ).pipe(
        tap(response => {
          this.saveTokens(response.access_token, response.refresh_token);
        }),
        catchError(error => {
          console.error('Login failed:', error);
          return throwError(() => error);
        })
    );
  }

  register(data: { username: string; email: string; password: string }) {
    return this.http.post<{ access_token: string; refresh_token: string }>(
      `${env.apiUrl}/auth/register`,
      data
    ).pipe(
      tap(response => {
        this.saveTokens(response.access_token, response.refresh_token);
      })
    );
  }

  // auth.service.ts
  refreshToken(): Observable<string> {
    if (this.isRefreshing) {
      return this.refreshTokenSubject.pipe(
          filter(token => token !== null),
          take(1),
          switchMap(token => of(token!))
      );
    }

    const refreshToken = this.refreshTokenValue;
    if (!refreshToken) {
      return throwError(() => new Error('No refresh token available'));
    }

    this.isRefreshing = true;
    this.refreshTokenSubject.next(null);

    return this.http.post<{ access_token: string }>(
        `${env.apiUrl}/auth/refresh`,
        { refresh_token: refreshToken }
    ).pipe(
        tap(response => {
          this.saveTokens(response.access_token, refreshToken);
          this.refreshTokenSubject.next(response.access_token);
        }),
        map(response => response.access_token),
        catchError(err => {
          this.refreshTokenSubject.next(null);
          this.logout();
          return throwError(() => err);
        }),
        finalize(() => {
          this.isRefreshing = false;
        })
    );
  }

  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    this.router.navigate(['/login']).catch(() => {});
  }
}
