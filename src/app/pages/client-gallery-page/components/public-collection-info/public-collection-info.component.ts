import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DropdownModule } from 'primeng/dropdown';
import { GalleriaModule } from 'primeng/galleria';
import {
  BehaviorSubject,
  catchError,
  combineLatest,
  distinctUntilChanged,
  finalize,
  of,
  shareReplay,
  tap,
} from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import type { PublicPhotosSort } from '../../../../api/collection-api.service';
import { CollectionApiService } from '../../../../api/collection-api.service';
import type { ServerFile, UploadFile } from '../../../../gallery-upload/interface/upload-file';
import { FileGridComponent } from '../../../../shared/components/cover-image/file-grid.component';
import { GridSettingsComponent } from '../../../../shared/components/grid-settings/grid-settings.component';
import { SortMenuComponent } from '../../../../shared/components/sort-menu/sort-menu.component';

@Component({
  selector: 'app-public-collection-info',
  imports: [
    DropdownModule,
    FormsModule,
    SortMenuComponent,
    GridSettingsComponent,
    FileGridComponent,
    AsyncPipe,
    GalleriaModule,
  ],
  templateUrl: './public-collection-info.component.html',
  styleUrl: './public-collection-info.component.scss',
})
export class PublicCollectionInfoComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly api = inject(CollectionApiService);

  readonly sort$ = new BehaviorSubject<PublicPhotosSort>('uploaded_new');
  readonly gridSize$ = new BehaviorSubject<'small' | 'large'>('small');
  readonly showFilename$ = new BehaviorSubject<boolean>(false);
  private readonly isLoadingSubject = new BehaviorSubject<boolean>(true);
  readonly isLoading$ = this.isLoadingSubject.asObservable();
  private readonly albumTitleSubject = new BehaviorSubject<string>('Медиа файлы');
  readonly albumTitle$ = this.albumTitleSubject.asObservable();
  readonly viewerVisible$ = new BehaviorSubject<boolean>(false);
  readonly viewerIndex$ = new BehaviorSubject<number>(0);
  viewerVisible: boolean = false;
  viewerIndex: number = 0;

  // token из маршрута
  readonly token$ = this.route.paramMap.pipe(
    map((pm) => pm.get('token')),
    distinctUntilChanged(),
  );

  // поток с файлами
  readonly files$ = combineLatest([this.token$, this.sort$]).pipe(
    tap(() => this.isLoadingSubject.next(true)),
    switchMap(([token, sort]) => {
      if (!token) return of<UploadFile[]>([]);
      return this.api.getPublicCollectionPhotos(token, sort).pipe(
        map((res: any) => {
          const list: any[] = res?.files ?? [];
          const title: string =
            res?.collection?.name ?? res?.album?.name ?? res?.title ?? 'Медиа файлы';
          this.albumTitleSubject.next(title);
          return list
            .map((photo: any) => {
              const name: string = photo.file_name ?? photo.name ?? '';
              const ext: string = String(photo.file_ext ?? '').replace('.', '');
              const uploadedAt: number = new Date(photo.uploaded_at ?? Date.now()).getTime();
              const size: number = Number(photo.size ?? 0);

              const thumb: string | undefined =
                photo.thumbnail_url ?? photo.thumb_url ?? photo.preview_url;
              const original: string | undefined =
                photo.url ?? photo.original_url ?? photo.public_url;

              const serverFile: ServerFile = {
                name,
                lastModified: uploadedAt,
                size,
                type: ext ? `image/${ext}` : 'image/*',
                hash: photo.hash ?? String(photo.id ?? name + uploadedAt),
              };

              const uf: UploadFile = {
                id: String(photo.id ?? crypto?.randomUUID?.() ?? `${name}-${uploadedAt}`),
                file: serverFile,
                progress: 100,
                previewUrl: thumb ?? original ?? '',
                loaded: true,
              };
              (uf as any).originalUrl = original ?? uf.previewUrl;
              return uf;
            })
            .filter((f: UploadFile) => !!f.previewUrl);
        }),
        catchError((err) => {
          console.error('public photos error', err);
          return of<UploadFile[]>([]);
        }),
        finalize(() => this.isLoadingSubject.next(false)),
      );
    }),
    shareReplay({ bufferSize: 1, refCount: true }),
  );

  // --- UI handlers ----
  onSortChange(sort: string): void {
    if (isPublicSort(sort)) this.sort$.next(sort);
  }

  onGridSizeChange(size: 'small' | 'large'): void {
    this.gridSize$.next(size);
  }

  onShowFilenameChange(value: boolean): void {
    this.showFilename$.next(value);
  }

  handleImageError(payload: { event: Event; file: UploadFile }): void {
    const img = payload.event.target as HTMLImageElement;
    const file = payload.file;
    const originalUrl = file.previewUrl.replace('/thumbs/', '/');
    if (originalUrl && originalUrl !== file.previewUrl) {
      img.src = originalUrl;
    }
  }

  openViewer(index: number): void {
    this.viewerIndex = index;
    this.viewerVisible = true;
  }

  getViewerSrc(file: UploadFile): string {
    return (file as any).originalUrl ?? file.previewUrl;
  }
}

// type guard для сортировки
function isPublicSort(v: string): v is PublicPhotosSort {
  return ['uploaded_new', 'uploaded_old', 'name_az', 'name_za', 'random'].includes(v);
}
