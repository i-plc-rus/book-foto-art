import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap, map, switchMap, filter, take } from 'rxjs/operators';
import {Observable, BehaviorSubject, of, throwError, catchError} from 'rxjs';
import { Router } from '@angular/router';
import { environment as env } from '../../../environment/environment';

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
        this.saveTokens(response.access_token, response.refresh_token);
      })
    );
  }

  refreshToken(): Observable<string> {
    if (this.isRefreshing) {
      return this.refreshTokenSubject.pipe(
        filter(token => token !== null),
        take(1),
        switchMap(token => of(token!))
      );
    } else {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      const refreshToken = this.refreshTokenValue;
      if (!refreshToken) {
        this.isRefreshing = false;
        return throwError(() => new Error('No refresh token available'));
      }

      return this.http.post<{ access_token: string; refresh_token?: string }>(
        `${env.apiUrl}/auth/refresh`,
        { refresh_token: refreshToken }
      ).pipe(
        tap(response => {
          this.saveTokens(response.access_token, response.refresh_token ?? refreshToken);
          this.isRefreshing = false;
          this.refreshTokenSubject.next(response.access_token);
        }),
        map(response => response.access_token),
        catchError(err => {
          this.isRefreshing = false;
          this.logout();
          return throwError(() => err);
        })
      );
    }
  }

  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    this.router.navigate(['/login']).catch(() => {});
  }
}
