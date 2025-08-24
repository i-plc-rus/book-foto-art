import type { OnInit } from '@angular/core';
import { computed, effect } from '@angular/core';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DropdownModule } from 'primeng/dropdown';
import { catchError, EMPTY, finalize, tap } from 'rxjs';

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
  ],
  templateUrl: './public-collection-info.component.html',
  styleUrl: './public-collection-info.component.scss',
})
export class PublicCollectionInfoComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly api = inject(CollectionApiService);
  private readonly destroyRef = inject(DestroyRef);

  readonly token = signal<string | null>(null);
  readonly files = signal<UploadFile[]>([]);
  readonly sortType = signal<PublicPhotosSort>('uploaded_new');
  readonly gridSize = signal<'small' | 'large'>('small');
  readonly showFilename = signal(false);
  readonly isLoading = signal(true);

  readonly showEmptyState = computed(() => this.files().length === 0 && !this.isLoading());

  ngOnInit(): void {
    // токен из маршрута
    this.route.paramMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((pm) => {
      this.token.set(pm.get('token'));
    });

    // загрузка фотографий при изменении токена или сортировки
    effect(() => {
      const t = this.token();
      const sort = this.sortType();
      if (!t) return;

      this.isLoading.set(true);
      this.api
        .getPublicCollectionPhotos(t, sort)
        .pipe(
          tap((res: any) => {
            const list: any[] = res?.files ?? [];

            const mapped: UploadFile[] = list
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
                  // обязательное поле для ServerFile в вашем проекте
                  hash: photo.hash ?? String(photo.id ?? name + uploadedAt),
                };

                const uf: UploadFile = {
                  id: String(photo.id ?? crypto.randomUUID()),
                  file: serverFile, // строго ServerFile
                  progress: 100,
                  previewUrl: thumb ?? original ?? '',
                  loaded: true,
                };

                return uf;
              })
              .filter((f) => !!f.previewUrl);

            this.files.set(mapped);
          }),
          catchError((err) => {
            console.error('public photos error', err);
            this.files.set([]);
            return EMPTY;
          }),
          finalize(() => this.isLoading.set(false)),
          takeUntilDestroyed(this.destroyRef),
        )
        .subscribe();
    });
  }

  onSortChange(sort: string): void {
    if (isPublicSort(sort)) this.sortType.set(sort);
  }

  onGridSizeChange(size: 'small' | 'large'): void {
    this.gridSize.set(size);
  }

  onShowFilenameChange(value: boolean): void {
    this.showFilename.set(value);
  }

  handleImageError(event: Event, file: UploadFile): void {
    const img = event.target as HTMLImageElement;
    // если превью не загрузилось — пробуем оригинал
    const originalUrl = file.previewUrl.replace('/thumbs/', '/');
    if (originalUrl && originalUrl !== file.previewUrl) {
      img.src = originalUrl;
    }
  }
}

function isPublicSort(v: string): v is PublicPhotosSort {
  return ['uploaded_new', 'uploaded_old', 'name_az', 'name_za', 'random'].includes(v);
}
