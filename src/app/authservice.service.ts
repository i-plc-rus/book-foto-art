import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs';

//const API_URL = 'http://localhost:8080/auth'; // <-- указываем URL бэкенда
const API_URL = 'https://api.bookfoto.art/auth'; // <-- указываем URL бэкенда

@Injectable({
  providedIn: 'root'
})
export class AuthserviceService {
  constructor(private http: HttpClient) {}

  login(credentials: { email: string, password: string }) {
    const form = new FormData();
    form.append('email', credentials.email);
    form.append('password', credentials.password);

    return this.http.post<{ token: string }>(`${API_URL}/login`, {
  email: credentials.email,
  password: credentials.password
})
      .pipe(
        tap(response => {
          localStorage.setItem('auth_token', response.token);
        })
      );
  }

  register(data: { username: string; email: string; password: string }) {
    return this.http.post<{ token: string }>(`${API_URL}/register`, data).pipe(
      tap(response => {
        localStorage.setItem('auth_token', response.token);
      })
    );
  }
}
