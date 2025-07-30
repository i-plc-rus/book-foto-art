import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment as env } from './../../../environment/environment';
import { Observable } from 'rxjs';
import { CollectionCreateDto, CollectionCreateResponse } from '../interface/collection';

@Injectable()
export class CollectionService {
  constructor(private http: HttpClient) {}

  createCollection(data: CollectionCreateDto): Observable<CollectionCreateResponse> {
    const token = localStorage.getItem('auth_token') || '';
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    });

    return this.http.post<CollectionCreateResponse>(`${env.apiUrl}/collection/create`, data, { headers });
  }
}
