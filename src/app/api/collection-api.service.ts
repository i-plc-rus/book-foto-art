import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import type { Observable } from 'rxjs';
import { map } from 'rxjs';

import { BASE_API_URL } from '../app.config';
import type { CollectionCreateDto, CollectionCreateResponse } from '../core/interfaces/collection';
import type {
  ICollectionInfo,
  ICollectionPhoto,
  IPublishResponse,
  IShortLinkInfo,
  IUnpublishResponse,
} from '../interfaces/collection.interface';

export type PublicPhotosSort = 'uploaded_new' | 'uploaded_old' | 'name_az' | 'name_za' | 'random';

/**
 * API -сервис для работы с коллекциями
 */
@Injectable({
  providedIn: 'root',
})
export class CollectionApiService {
  private readonly httpClient: HttpClient = inject(HttpClient);
  private readonly baseUrl: string = inject(BASE_API_URL);

  createCollection(data: CollectionCreateDto): Observable<CollectionCreateResponse> {
    const token = localStorage.getItem('auth_token') || '';
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });

    return this.httpClient.post<CollectionCreateResponse>(
      `${this.baseUrl}/collection/create`,
      data,
      {
        headers,
      },
    );
  }

  getCollectionDelete(
    collectionId: string,
    queryParams: { [key: string]: string } = {},
  ): Observable<any[]> {
    const params = new HttpParams({ fromObject: queryParams });
    return this.httpClient.delete<any[]>(`${this.baseUrl}/collection/${collectionId}`, { params });
  }

  getCollectionList(): Observable<any> {
    return this.httpClient.get(`${this.baseUrl}/collection/list`).pipe(
      map((response) => {
        if (typeof response === 'string') {
          try {
            return JSON.parse(response);
          } catch (e) {
            console.error('Error parsing response', e);
            return { collections: [] };
          }
        }
        return response;
      }),
    );
  }

  /**
   * Получить информацию о коллекции
   * @param id идентификатор коллекции
   */
  getCollection(id: string): Observable<ICollectionInfo> {
    return this.httpClient.get<ICollectionInfo>(`${this.baseUrl}/collection/${id}`);
  }

  /**
   * Загрузить фотографии из коллекции
   * @param id идентификатор коллекции
   */
  getCollectionPhotos(id: string): Observable<ICollectionPhoto> {
    return this.httpClient.get<ICollectionPhoto>(`${this.baseUrl}/collection/${id}/photos`).pipe();
  }

  /**
   * Публикация коллекции → возвращает короткую ссылку
   * @param id идентификатор коллекции
   */
  publishCollection(id: string): Observable<IPublishResponse> {
    return this.httpClient.put<IPublishResponse>(`${this.baseUrl}/collection/${id}/publish`, {});
  }

  /**
   * Снятие публикации (отзыв доступа)
   * @param id идентификатор коллекции
   */
  unpublishCollection(id: string): Observable<IUnpublishResponse> {
    return this.httpClient.put<IUnpublishResponse>(
      `${this.baseUrl}/collection/${id}/unpublish`,
      {},
    );
  }

  /**
   * Получить информацию о короткой ссылке
   * @param token токен короткой ссылки
   */
  getShortLinkInfo(token: string): Observable<IShortLinkInfo> {
    return this.httpClient.get<IShortLinkInfo>(
      `${this.baseUrl}/collection/short_link_info/${token}`,
    );
  }

  /**
   * Фотографии публичной коллекции по токену короткой ссылки
   * @param token
   * @param sort
   */
  getPublicCollectionPhotos(
    token: string,
    sort: PublicPhotosSort = 'uploaded_new',
  ): Observable<ICollectionPhoto> {
    const params = new HttpParams().set('sort', sort);
    return this.httpClient.get<ICollectionPhoto>(
      `${this.baseUrl}/public/collection/${token}/photos`,
      { params },
    );
  }
}
