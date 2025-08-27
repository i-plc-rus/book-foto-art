import { DatePipe } from '@angular/common';
import type { ElementRef, OnInit, WritableSignal } from '@angular/core';
import { viewChild } from '@angular/core';
import { computed, DestroyRef, inject, signal } from '@angular/core';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import {
  BehaviorSubject,
  catchError,
  combineLatest,
  distinctUntilChanged,
  finalize,
  of,
  tap,
} from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import type { PublicPhotosSort } from '../../../api/collection-api.service';
import { CollectionApiService } from '../../../api/collection-api.service';
import type { UploadFile } from '../../../gallery-upload/interface/upload-file';
import type { ICollectionInfo, PreviewItem } from '../../../interfaces/collection.interface';
import { ModalService } from '../../../shared/service/modal/modal.service';
import { GalleryImageCardComponent } from '../components/gallery-image-card/gallery-image-card.component';

@Component({
  selector: 'app-collection-site',
  templateUrl: './collection-site.component.html',
  styleUrls: ['./collection-site.component.scss'],
  imports: [DatePipe, RouterLink, GalleryImageCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class CollectionSiteComponent implements OnInit {
  private readonly modalService = inject(ModalService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly route = inject(ActivatedRoute);
  private readonly api = inject(CollectionApiService);

  // state
  readonly loading: WritableSignal<boolean> = signal(false);
  readonly error: WritableSignal<string | null> = signal(null);
  readonly collectionInfo: WritableSignal<ICollectionInfo | null> = signal(null);

  // ключевое — оставляем UploadFile[]
  readonly images: WritableSignal<UploadFile[]> = signal<UploadFile[]>([]);
  private readonly favorite = signal<Set<number>>(new Set());

  // sort/controls (задел под будущие кнопки)
  readonly sort$ = new BehaviorSubject<PublicPhotosSort>('uploaded_new');

  readonly previewImages = computed<PreviewItem[]>(() =>
    this.images().map((f, i) => ({
      link: (f as any).originalUrl ?? f.previewUrl, // берём оригинал, иначе превью
      isFavorite: this.favorite().has(i),
    })),
  );

  readonly thumbImages = computed<PreviewItem[]>(() =>
    this.images().map((f, i) => ({
      link: f.previewUrl,
      isFavorite: this.favorite().has(i),
    })),
  );

  private readonly galleryRef = viewChild<ElementRef>('galleryRef');

  ngOnInit(): void {
    this.loadPublic();
  }

  private loadPublic(): void {
    const token$ = this.route.paramMap.pipe(
      map((pm) => pm.get('token')),
      distinctUntilChanged(),
    );

    combineLatest([token$, this.sort$])
      .pipe(
        tap(() => {
          this.loading.set(true);
          this.error.set(null);
          this.images.set([]);
        }),
        switchMap(([token, sort]) => {
          if (!token) {
            this.loading.set(false);
            this.error.set('Коллекция не найдена');
            return of<UploadFile[]>([]);
          }

          return this.api.getPublicCollectionPhotos(token, sort).pipe(
            // если API уже возвращает именно UploadFile[], ничего не трогаем
            map((res: any) =>
              Array.isArray(res)
                ? (res as UploadFile[])
                : Array.isArray(res?.files)
                  ? (res.files as UploadFile[])
                  : [],
            ),
            catchError((err) => {
              console.error('public photos error', err);
              this.error.set('Не удалось загрузить коллекцию');
              return of<UploadFile[]>([]);
            }),
            finalize(() => this.loading.set(false)),
          );
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((files: UploadFile[]) => this.images.set(files));
  }

  scrollToGallery(): void {
    this.galleryRef()?.nativeElement.scrollIntoView({ behavior: 'smooth' });
  }

  showCurrentImage(index: number): void {
    this.modalService
      .previewImage({ images: this.previewImages, currentIndex: index })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((favIndex) => this.toggleFavoriteIndex(favIndex));
  }

  showSlider(): void {
    this.modalService
      .openImageSlider({ images: this.previewImages, currentIndex: signal(0) })
      .pipe(
        switchMap((currentIndex) =>
          this.modalService.previewImage({ images: this.previewImages, currentIndex }),
        ),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((finalIndex) => this.toggleFavoriteIndex(finalIndex));
  }

  private toggleFavoriteIndex(index: number): void {
    this.favorite.update((set) => {
      const next = new Set(set);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  }
}
