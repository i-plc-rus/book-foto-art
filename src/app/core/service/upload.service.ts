import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpEventType, HttpHeaders, HttpRequest } from '@angular/common/http';
import {Observable, catchError, map, throwError} from 'rxjs';
import { environment as env } from './../../../environment/environment';

@Injectable({ providedIn: 'root' })
export class UploadService {
  constructor(private http: HttpClient) {}

  uploadFile(file: File, collectionId: string): Observable<{ progress: number }> {
    const token = localStorage.getItem('auth_token');

    if (!token) {
      return throwError(() => new Error('Authorization token is missing'));
    }

    const formData = new FormData();

    formData.append('file', file, file.name);
    formData.append('collectionId', collectionId);

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.post<any>(`${env.apiUrl}/upload/files`, formData, {
      reportProgress: true,
      observe: 'events',
      headers: headers
    }).pipe(
      map((event: HttpEvent<any>) => {
        if (event.type === HttpEventType.UploadProgress && event.total) {
          const progress = Math.round((event.loaded / event.total) * 100);
          return { progress };
        } else if (event.type === HttpEventType.Response) {
          return { progress: 100 };
        }
        return { progress: 0 };
      }),
      catchError(error => {
        console.error('Upload error:', error);
        return throwError(() => error);
      })
    );
  }
}
