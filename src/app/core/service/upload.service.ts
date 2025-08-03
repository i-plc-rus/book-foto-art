import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpEventType } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
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
      map((event: HttpEvent<any>) => this.getUploadProgress(event)),
      catchError(error => {
        console.error('Upload failed', error);
        return throwError(() => new Error('Upload failed'));
      })
    );
  }

  private getUploadProgress(event: HttpEvent<any>): { progress: number } {
    switch (event.type) {
      case HttpEventType.UploadProgress:
        const total = event.total || 1;
        const progress = Math.round(100 * (event.loaded / total));
        return { progress };
      case HttpEventType.Response:
        return { progress: 100 };
      default:
        return { progress: 0 };
    }
  }
}
