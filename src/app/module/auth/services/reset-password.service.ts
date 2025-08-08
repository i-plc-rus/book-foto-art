import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment as env} from '../../../../environments/environment';
import {IHttpResponse} from '../../../core/interfaces/http-response.interface';

@Injectable()

export class ResetPasswordService {
  private http = inject(HttpClient);
  private apiUrl = `${env.apiUrl}`;

  reset(email: string | null): Observable<IHttpResponse<string>> {
    return this.http.post<IHttpResponse<string>>(`${this.apiUrl}/auth/forgot-password`, {email})
  }
}
