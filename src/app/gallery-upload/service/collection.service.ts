import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import type { Observable } from 'rxjs';

import { environment as env } from '../../../environments/environment';

@Injectable()
export class CollectionService {
  private http = inject(HttpClient);
  private apiUrl = `${env.apiUrl}/collection`;

  getPhotosIngo(
    collectionId: string,
    queryParams: { [key: string]: string } = {},
  ): Observable<any[]> {
    const params = new HttpParams({ fromObject: queryParams });
    return this.http.get<any[]>(`${this.apiUrl}/${collectionId}`, { params });
  }

  getPhotos(collectionId: string, queryParams: { [key: string]: string } = {}): Observable<any[]> {
    const params = new HttpParams({ fromObject: queryParams });
    return this.http.get<any[]>(`${this.apiUrl}/${collectionId}/photos`, { params });
  }
}
