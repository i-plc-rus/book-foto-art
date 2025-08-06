import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment as env} from '../../../environment/environment';
import {Observable} from 'rxjs';

@Injectable()
export class CollectionService {

  private http = inject(HttpClient);
  private apiUrl = `${env.apiUrl}/collection`;


  getPhotosIngo(collectionId: string, queryParams: { [key: string]: string } = {}): Observable<any[]> {
    const params = new HttpParams({ fromObject: queryParams });
    return this.http.get<any[]>(`${this.apiUrl}/${collectionId}`, { params });
  }

  getPhotos(collectionId: string, queryParams: { [key: string]: string } = {}): Observable<any[]> {
    const params = new HttpParams({ fromObject: queryParams });
    return this.http.get<any[]>(`${this.apiUrl}/${collectionId}/photos`, { params });
  }
}
