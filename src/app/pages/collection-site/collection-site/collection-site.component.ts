import { DatePipe } from '@angular/common';
import type { ElementRef, OnInit, WritableSignal } from '@angular/core';
import { computed } from '@angular/core';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { catchError, of, switchMap } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import { CollectionApiService } from '../../../api/collection-api.service';
import type {
  ICollectionInfo,
  ICollectionPhoto,
  IUploadedPhoto,
  PreviewItem,
} from '../../../interfaces/collection.interface';
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
  private readonly modalService: ModalService = inject(ModalService);
  private readonly destroyRef: DestroyRef = inject(DestroyRef);
  private readonly activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private readonly collectionApiService: CollectionApiService = inject(CollectionApiService);

  readonly loading: WritableSignal<boolean> = signal<boolean>(false);
  readonly error: WritableSignal<string | null> = signal<string | null>(null);
  readonly collectionInfo: WritableSignal<ICollectionInfo | null> = signal<ICollectionInfo | null>(
    null,
  );
  readonly images: WritableSignal<IUploadedPhoto[]> = signal<IUploadedPhoto[]>([]);
  private readonly favorite: WritableSignal<Set<number>> = signal<Set<number>>(new Set());
  readonly previewImages = computed<PreviewItem[]>(() =>
    this.images().map((photo, i) => ({
      link: photo.original_url,
      isFavorite: this.favorite().has(i),
    })),
  );

  readonly thumbImages = computed<PreviewItem[]>(() =>
    this.images().map((photo, i) => ({
      link: photo.thumbnail_url,
      isFavorite: this.favorite().has(i),
    })),
  );

  private readonly galleryRef = viewChild<ElementRef>('galleryRef');

  ngOnInit(): void {
    this.getCollection();
  }

  /**
   * Загрузить данные о коллекции
   */
  getCollection(): void {
    this.activatedRoute.paramMap
      .pipe(
        map((paramMap) => paramMap.get('id')),
        filter((id): id is string => !!id),
        switchMap((id: string) => {
          this.loading.set(true);
          this.error.set(null);

          return this.collectionApiService.getCollection(id).pipe(
            switchMap((info) => {
              this.collectionInfo.set(info);
              return this.collectionApiService.getCollectionPhotos(id);
            }),
            catchError(() => {
              this.error.set('Не удалось загрузить коллекцию');
              this.loading.set(false);
              return of(null);
            }),
          );
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((photos: ICollectionPhoto | null) => {
        this.loading.set(false);
        if (photos) {
          this.images.set(photos.files); // кладём список фоток
        }
      });
  }

  scrollToGallery(): void {
    this.galleryRef()?.nativeElement.scrollIntoView({ behavior: 'smooth' });
  }

  showCurrentImage(index: number): void {
    this.modalService
      .previewImage({
        images: this.previewImages, // Signal<{link,isFavorite}[]>
        currentIndex: index,
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((favIndex) => {
        this.toggleFavoriteIndex(favIndex);
      });
  }

  showSlider(): void {
    this.modalService
      .openImageSlider({
        images: this.previewImages, // тот же адаптер
        currentIndex: signal(0),
      })
      .pipe(
        switchMap((currentIndex) =>
          this.modalService.previewImage({
            images: this.previewImages,
            currentIndex,
          }),
        ),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((finalIndex) => {
        this.toggleFavoriteIndex(finalIndex);
      });
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
