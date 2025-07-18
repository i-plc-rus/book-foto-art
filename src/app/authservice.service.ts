import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthserviceService {

  constructor(private http: HttpClient) {}
  login(credentials: { email: string, password: string }) {
    const form = new FormData();
    form.append('username', credentials.email);
    form.append('password', credentials.password);
    return this.http.post('/api/login', form);
  }

  register(data: { email: string, password: string }) {
    return this.http.post('/api/register', data);
  }
  

}
