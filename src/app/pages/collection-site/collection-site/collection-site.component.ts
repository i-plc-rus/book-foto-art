import { DatePipe } from '@angular/common';
import type { ElementRef, OnInit, WritableSignal } from '@angular/core';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
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
import type { ICollectionInfoResponse } from '../../../interfaces/collection.interface';
import { ModalService } from '../../../shared/service/modal/modal.service';
import { GalleryImageCardComponent } from '../components/gallery-image-card/gallery-image-card.component';

interface ISavedGallery {
  name: string;
  userName: string;
  createDate: string;
  images: {
    link: string;
    isFavorite: boolean;
  }[];
}

export const mockGalleries: ISavedGallery = {
  name: 'Мужская фотосессия #1',
  userName: 'Nursultan',
  createDate: '2025-07-10',
  images: [
    {
      link: 'assets/mockImages/8dfa455df6206f75c8bee021fdeca0b9.jpg',
      isFavorite: false,
    },
    {
      link: 'assets/mockImages/7ca83dc4f5e31627917e87ac7c6ba77d.jpg',
      isFavorite: true,
    },
    {
      link: 'assets/mockImages/1702895570_bogatyr-club-p-koshechka-iz-toma-i-dzherri-foni-instagram-4.png',
      isFavorite: true,
    },
    {
      link: 'assets/mockImages/ead3b558586cc51653230d9eaf58f503.jpg',
      isFavorite: true,
    },
    {
      link: 'assets/mockImages/f4319ba238bdc7da00c56adbb45461dc.jpg',
      isFavorite: false,
    },
    {
      link: 'assets/mockImages/8dfa455df6206f75c8bee021fdeca0b9.jpg',
      isFavorite: false,
    },
    {
      link: 'assets/mockImages/7ca83dc4f5e31627917e87ac7c6ba77d.jpg',
      isFavorite: true,
    },
    {
      link: 'assets/mockImages/1702895570_bogatyr-club-p-koshechka-iz-toma-i-dzherri-foni-instagram-4.png',
      isFavorite: true,
    },
    {
      link: 'assets/mockImages/ead3b558586cc51653230d9eaf58f503.jpg',
      isFavorite: true,
    },
    {
      link: 'assets/mockImages/f4319ba238bdc7da00c56adbb45461dc.jpg',
      isFavorite: false,
    },
    {
      link: 'assets/mockImages/8dfa455df6206f75c8bee021fdeca0b9.jpg',
      isFavorite: false,
    },
    {
      link: 'assets/mockImages/7ca83dc4f5e31627917e87ac7c6ba77d.jpg',
      isFavorite: true,
    },
    {
      link: 'assets/mockImages/1702895570_bogatyr-club-p-koshechka-iz-toma-i-dzherri-foni-instagram-4.png',
      isFavorite: true,
    },
    {
      link: 'assets/mockImages/ead3b558586cc51653230d9eaf58f503.jpg',
      isFavorite: true,
    },
    {
      link: 'assets/mockImages/f4319ba238bdc7da00c56adbb45461dc.jpg',
      isFavorite: false,
    },
  ],
};

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
  readonly collectionInfo: WritableSignal<ICollectionInfoResponse | null> =
    signal<ICollectionInfoResponse | null>(null);

  readonly gallery = signal<ISavedGallery>(mockGalleries);
  readonly images = computed(() => this.gallery().images);

  private readonly galleryRef = viewChild<ElementRef>('galleryRef');

  get firstImage(): string {
    return this.gallery()?.images[0]?.link || 'assets/default.jpg';
  }

  ngOnInit(): void {
    this.getCollection();
  }

  getCollection(): void {
    this.activatedRoute.paramMap
      .pipe(
        map((paramMap) => paramMap.get('id')),
        filter((id): id is string => !!id),
        switchMap((id: string) => {
          this.loading.set(true);
          this.error.set(null);

          return this.collectionApiService.getCollection(id).pipe(
            catchError((err) => {
              this.error.set('Не удалось загрузить коллекцию');
              this.loading.set(false);
              return of(null);
            }),
          );
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((resp: ICollectionInfoResponse | null) => {
        this.loading.set(false);
        if (resp) {
          this.collectionInfo.set(resp);
        }
      });
  }

  scrollToGallery(): void {
    this.galleryRef()?.nativeElement.scrollIntoView({ behavior: 'smooth' });
  }

  toggleFavorite(index: number): void {
    const current = this.gallery();

    const updatedImages = current.images.map((image, i) =>
      i === index ? { ...image, isFavorite: !image.isFavorite } : image,
    );

    this.gallery.update((g) => ({
      ...g,
      images: updatedImages,
    }));
  }

  showCurrentImage(index: number): void {
    this.modalService
      .previewImage({ currentIndex: index, images: this.images })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((favIndex) => {
        this.toggleFavorite(favIndex);
      });
  }

  showSlider(): void {
    this.modalService
      .openImageSlider({
        images: this.images,
        currentIndex: signal(0),
      })
      .pipe(
        switchMap((currentIndex) =>
          this.modalService.previewImage({
            images: this.images,
            currentIndex,
          }),
        ),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((finalIndex) => {
        this.toggleFavorite(finalIndex);
      });
  }
}
