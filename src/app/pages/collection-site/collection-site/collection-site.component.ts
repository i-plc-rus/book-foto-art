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
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { catchError, of, switchMap } from 'rxjs';
import { map } from 'rxjs/operators';

import { CollectionApiService } from '../../../api/collection-api.service';
import type {
  ICollectionPhoto,
  IUploadedPhoto,
  PreviewItem,
} from '../../../interfaces/collection.interface';
import { ModalService } from '../../../shared/service/modal/modal.service';
import { GalleryImageCardComponent } from '../components/gallery-image-card/gallery-image-card.component';
import { ImageEventType } from '../model/image-preview.model';

@Component({
  selector: 'app-collection-site',
  templateUrl: './collection-site.component.html',
  styleUrls: ['./collection-site.component.scss'],
  imports: [DatePipe, RouterLink, GalleryImageCardComponent, ConfirmDialog],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class CollectionSiteComponent implements OnInit {
  private readonly modalService: ModalService = inject(ModalService);
  private readonly destroyRef: DestroyRef = inject(DestroyRef);
  private readonly activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private readonly router: Router = inject(Router);
  private readonly collectionApiService: CollectionApiService = inject(CollectionApiService);
  private readonly confirmation = inject(ConfirmationService);
  private readonly messageService = inject(MessageService);

  readonly loading: WritableSignal<boolean> = signal<boolean>(false);
  readonly error: WritableSignal<string | null> = signal<string | null>(null);
  readonly collectionInfo: WritableSignal<ICollectionPhoto | null> =
    signal<ICollectionPhoto | null>(null);

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
        map((pm) => pm.get('token')),
        switchMap((token) => {
          if (!token) {
            this.router.navigate(['/404']).catch(() => {});
            return of(null);
          }

          this.loading.set(true);
          this.error.set(null);

          return this.collectionApiService.getPublicCollectionPhotos(token).pipe(
            catchError(() => {
              this.loading.set(false);
              this.router.navigate(['/404']).catch(() => {});
              return of(null);
            }),
          );
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((resp: ICollectionPhoto | null) => {
        this.loading.set(false);
        if (!resp) {
          // на случай, если выше не сработала навигация
          this.router.navigate(['/404']).catch(() => {});
          return;
        }
        this.collectionInfo.set(resp);
        this.images.set(resp.files ?? []);
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
      .subscribe((event) => {
        if (event.type === ImageEventType.favorite) {
          this.toggleFavoriteIndex(event.index);
          return;
        }
        if (event.type === ImageEventType.delete) {
          this.confirmAndDelete(event.index);
        }
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
      .subscribe((event) => {
        if (event.type === ImageEventType.favorite) {
          this.toggleFavoriteIndex(event.index);
          return;
        }
        if (event.type === ImageEventType.delete) {
          this.confirmAndDelete(event.index);
        }
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

  private confirmAndDelete(index: number): void {
    const photo = this.images()[index];
    if (!photo) return;

    this.confirmation.confirm({
      key: 'deleteImage',
      header: 'Удалить фото?',
      message: `Вы действительно хотите удалить «${photo.file_name ?? 'фото'}»? Действие необратимо.`,
      rejectButtonProps: { label: 'Отмена', severity: 'secondary', text: true },
      acceptButtonProps: { label: 'Удалить' },
      icon: 'pi pi-exclamation-triangle',
      accept: () => this.deleteImageByIndex(index),
    });
  }

  private deleteImageByIndex(index: number): void {
    const list = this.images();
    const photo = list[index];
    if (!photo) return;

    // вызов API удаления
    this.collectionApiService
      .deletePhoto(photo.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          // локально обновляем список
          this.images.update((arr) => arr.filter((_, i) => i !== index));
          this.messageService.add({
            severity: 'success',
            summary: 'Удалено',
            detail: photo.file_name ?? 'Файл',
            life: 2000,
          });
        },
        error: (err) => {
          console.error('Ошибка удаления', err);
          this.messageService.add({
            severity: 'error',
            summary: 'Ошибка',
            detail: 'Не удалось удалить фото',
            life: 3000,
          });
        },
      });
  }
}
