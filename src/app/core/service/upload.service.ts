import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpEventType, HttpHeaders, HttpRequest } from '@angular/common/http';
import {Observable, catchError, map, throwError} from 'rxjs';
import { environment as env } from './../../../environment/environment';

@Injectable({ providedIn: 'root' })
export class UploadService {
  constructor(private http: HttpClient) {}

  uploadFile(file: File, collectionId: string): Observable<{ progress: number }> {
    if (!collectionId) {
      return throwError(() => new Error('collection_id is missing'));
    }

    const formData = new FormData();
    formData.append('files', file, file.name);
    formData.append('collection_id', collectionId);

    return this.http.post<any>(`${env.apiUrl}/upload/files`, formData, {
      reportProgress: true,
      observe: 'events'
    }).pipe(
      map((event: HttpEvent<any>) => {
        if (event.type === HttpEventType.UploadProgress && event.total) {
          const progress = Math.round((event.loaded / event.total) * 100);
          return { progress };
        } else if (event.type === HttpEventType.Response) {
          return { progress: 100 };
        }
        return { progress: 0 };
      })
    );
  }
}
