import type { OnInit } from '@angular/core';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { catchError, EMPTY } from 'rxjs';
import { take } from 'rxjs/operators';

import type { PublicPhotosSort } from '../../../../api/collection-api.service';
import { CollectionApiService } from '../../../../api/collection-api.service';
import type { ICollectionPhoto } from '../../../../interfaces/collection.interface';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { ProgressSpinner } from 'primeng/progressspinner';
import { NgOptimizedImage } from '@angular/common';
export type PhotoItem = { url: string; name?: string };
@Component({
  selector: 'app-public-collection-info',
  imports: [DropdownModule, FormsModule, ProgressSpinner, NgOptimizedImage],
  templateUrl: './public-collection-info.component.html',
  styleUrl: './public-collection-info.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PublicCollectionInfoComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly api = inject(CollectionApiService);
  private readonly destroyRef = inject(DestroyRef);

  readonly loading = signal<boolean>(true);
  readonly error = signal<string | null>(null);
  readonly sort = signal<PublicPhotosSort>('uploaded_new');
  readonly photos = signal<PhotoItem[]>([]);
  readonly token = signal<string>('');

  readonly sortOptions: { label: string; value: PublicPhotosSort }[] = [
    { label: 'Новые сверху', value: 'uploaded_new' },
    { label: 'Старые сверху', value: 'uploaded_old' },
    { label: 'Имя A–Z', value: 'name_az' },
    { label: 'Имя Z–A', value: 'name_za' },
    { label: 'Случайно', value: 'random' },
  ];

  ngOnInit(): void {
    const t = this.route.snapshot.paramMap.get('token');
    if (!t) {
      this.fail('Токен не найден');
      return;
    }
    this.token.set(t);

    this.load(this.sort());
  }

  private fail(message: string): void {
    this.error.set(message);
    this.loading.set(false);
  }

  private load(sort: PublicPhotosSort): void {
    this.loading.set(true);
    this.api
      .getPublicCollectionPhotos(this.token(), sort)
      .pipe(
        take(1),
        takeUntilDestroyed(this.destroyRef),
        catchError((err) => {
          console.error('public photos error', err);
          this.fail('Не удалось загрузить фотографии');
          return EMPTY;
        }),
      )
      .subscribe((res: ICollectionPhoto) => {
        // приведи к своему формату; здесь предполагается, что в ответе есть массив urls
        const items: PhotoItem[] =
          (res as any)?.photos?.map((p: any) => ({ url: p.url, name: p.name })) ?? [];
        this.photos.set(items);
        this.loading.set(false);
        this.error.set(null);
      });
  }

  onSortChange(value: PublicPhotosSort): void {
    if (value === this.sort()) return;
    this.sort.set(value);
    this.load(value);
  }
}
