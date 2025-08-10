import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import { environment as env } from '../../../environments/environment';
import {map, Observable} from 'rxjs';
import { CollectionCreateDto, CollectionCreateResponse } from '../interfaces/collection';
import {ISavedGallery} from '../../gallery-upload/interface/upload-file';

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

  // getCollection(): Observable<any[]> {
  //   return this.http.get<any[]>(`${env.apiUrl}/collection/list`);
  // }

  getCollectionDelete(collectionId: string, queryParams: { [key: string]: string } = {}): Observable<any[]> {
    const params = new HttpParams({ fromObject: queryParams });
    return this.http.delete<any[]>(`${env.apiUrl}/collection/${collectionId}`, { params });
  }

  getGalleryById(id: string): Observable<ISavedGallery> {
    return this.http.get<ISavedGallery>(`${env.apiUrl}/galleries/${id}`);
  }

  getCollection(): Observable<any> {
    return this.http.get(`${env.apiUrl}/collection/list`).pipe(
      map(response => {
        if (typeof response === 'string') {
          try {
            return JSON.parse(response);
          } catch (e) {
            console.error('Error parsing response', e);
            return { collections: [] };
          }
        }
        return response;
      })
    );
  }
}
