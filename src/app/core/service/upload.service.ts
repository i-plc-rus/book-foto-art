import type { HttpEvent } from '@angular/common/http';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import type { Observable } from 'rxjs';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { environment as env } from '../../../environments/environment';

export interface UploadProgress {
  progress: number;
  /** тело финального ответа сервера; есть только на последнем событии */
  body?: any;
}

@Injectable({ providedIn: 'root' })
export class UploadService {
  private readonly http: HttpClient = inject(HttpClient);

  uploadFile(file: File, collectionId: string): Observable<UploadProgress> {
    if (!collectionId) {
      return throwError(() => new Error('collection_id is missing'));
    }

    const formData = new FormData();
    formData.append('files', file, file.name);
    formData.append('collection_id', collectionId);

    return this.http
      .post(`${env.apiUrl}/upload/files`, formData, {
        reportProgress: true,
        observe: 'events',
      })
      .pipe(
        map((event: HttpEvent<any>): UploadProgress => this.getUploadProgress(event)),
        catchError((error) => {
          console.error('Upload failed', error);
          return throwError(() => new Error('Upload failed'));
        }),
      );
  }

  private getUploadProgress(event: HttpEvent<any>): UploadProgress {
    switch (event.type) {
      case HttpEventType.UploadProgress: {
        const total = event.total || 1;
        const progress = Math.round(100 * (event.loaded / total));
        return { progress };
      }
      case HttpEventType.Response:
        // ВАЖНО: возвращаем body финального ответа
        return { progress: 100, body: event.body };
      default:
        return { progress: 0 };
    }
  }
}
