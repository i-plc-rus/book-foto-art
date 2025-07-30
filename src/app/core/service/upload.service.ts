import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpEventType, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Observable, catchError, map, of } from 'rxjs';
import { environment as env } from './../../../environment/environment';

@Injectable({ providedIn: 'root' })
export class UploadService {
  constructor(private http: HttpClient) {}

  uploadFile(file: File): Observable<{ progress: number, loaded: number }> {
    const formData = new FormData();
    const collectionId = localStorage.getItem('collectionId');

    if (!collectionId) {
      throw new Error('collectionId is missing');
    }

    formData.append('file', file);
    formData.append('collectionId', collectionId);
    formData.append('fileName', file.name);

    return this.http.post<any>('/api/upload', formData, {
      reportProgress: true,
      observe: 'events'
    }).pipe(
      map((event: HttpEvent<any>) => {
        if (event.type === HttpEventType.UploadProgress) {
          const progress = event.total ? Math.round((event.loaded / event.total) * 100) : 0;
          return { progress, loaded: 0 };
        } else if (event.type === HttpEventType.Response) {
          return { progress: 100, loaded: 1 };
        } else {
          return { progress: 0, loaded: 0 };
        }
      }),
      catchError(error => {
        console.error('Upload error:', error);
        return of({ progress: 0, loaded: 0 });
      })
    );
  }

}
