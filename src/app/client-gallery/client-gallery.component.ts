import { CommonModule, NgTemplateOutlet } from '@angular/common';
import { Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CollectionService } from '../core/service/collection.service.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CollectionCardComponent } from '../module/client-gallery/components/collection-card/collection-card.component';
import { CollectionHeaderComponent } from '../module/client-gallery/components/collection-header/collection-header.component';
import { CollectionSortComponent } from '../module/client-gallery/components/collection-sort/collection-sort.component';
import { CollectionTableComponent } from '../module/client-gallery/components/collection-table/collection-table.component';
import { CollectionViewComponent } from '../module/client-gallery/components/collection-view/collection-view.component';
import { FilterDateComponent } from '../module/client-gallery/components/filter-date/filter-date.component';
import { FilterDropdownComponent } from '../module/client-gallery/components/filter-dropdown/filter-dropdown.component';
import { STATUS, EVENT_DATE, CATEGORY_TAG, EXPIRY_DATE, STARRED } from '../module/client-gallery/models/filter.model';
import { CollectionActionPayload, CollectionActionType, DisplayView, SortOption } from '../module/client-gallery/models/collection-display.model';
import dayjs from 'dayjs';
import { GALLERY_STORAGE_KEY, ISavedGallery } from '../gallery-upload/interface/upload-file';
import { ModalService } from '../shared/service/modal/modal.service';
import { ShareCollectionModalComponent } from '../module/client-gallery/modal/share-collection-modal/share-collection-modal.component';

@Component({
  standalone: true,
  selector: 'app-client-gallery',
  templateUrl: './client-gallery.component.html',
  styleUrls: ['./client-gallery.component.css'],
  imports: [CommonModule, 
    FormsModule,     
    CollectionHeaderComponent,
    FilterDropdownComponent,
    FilterDateComponent,
    CollectionSortComponent,
    CollectionViewComponent,
    CollectionCardComponent,
    CollectionTableComponent,
    NgTemplateOutlet
  ],
  providers: [CollectionService]
})
export class ClientGalleryComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);
  private readonly collectionService = inject(CollectionService);
  private readonly modalService = inject(ModalService)

  readonly STATUS = STATUS;
  readonly EVENT_DATE = EVENT_DATE;
  readonly CATEGORY_TAG = CATEGORY_TAG;
  readonly EXPIRY_DATE = EXPIRY_DATE;
  readonly STARRED = STARRED;


  readonly currentStep = signal(1);
  readonly galleryName = signal('');
  readonly galleryDate = signal('');

  readonly sortOption = signal<SortOption>(SortOption.CreatedNew);
  readonly dateRange = signal<[dayjs.Dayjs, dayjs.Dayjs] | null>(null);
  readonly displayView = signal<DisplayView>('grid');
  readonly collections = signal<ISavedGallery[]>([]);
  readonly isCreatingNewCollection = signal(false);
  readonly searchTerm = signal('');

  isLoading = false;
  errorMessage = '';
  collectionId: string | undefined;

    private readonly sortedCollections = computed(() => {
    const list = [...this.collections()];
    const sort = this.sortOption();

    switch (sort) {
      case SortOption.CreatedNew:
        return list.sort(
          (a, b) => +new Date(b.createDate) - +new Date(a.createDate)
        );
      case SortOption.CreatedOld:
        return list.sort(
          (a, b) => +new Date(a.createDate) - +new Date(b.createDate)
        );
      case SortOption.NameAsc:
        return list.sort((a, b) => a.name.localeCompare(b.name));
      case SortOption.NameDesc:
        return list.sort((a, b) => b.name.localeCompare(a.name));
      default:
        return list;
    }
  });

  readonly filteredCollections = computed(() => {
    const term = this.searchTerm().toLowerCase();
    const range = this.dateRange();
    const list = this.sortedCollections();

    return list.filter((item) => {
      const nameMatch = !term || item.name.toLowerCase().includes(term);

      const dateMatch =
        !range ||
        (dayjs(item.createDate).isAfter(range[0].subtract(1, 'day')) &&
          dayjs(item.createDate).isBefore(range[1].add(1, 'day')));

      return nameMatch && dateMatch;
    });
  });

  readonly isGalleryEmpty = computed(() => !!this.collections().length);

  constructor() {
    this.loadCollectionsFromStorage();
  }

  private loadCollectionsFromStorage(): void {
    const raw = localStorage.getItem(GALLERY_STORAGE_KEY);
    if (!raw) return;

    try {
      const parsed = JSON.parse(raw) as ISavedGallery[];
      if (Array.isArray(parsed)) {
        this.collections.set(parsed);
      }
    } catch (error) {
      console.error('Invalid JSON in localStorage for savedGalleries:', error);
    }
  }

  handleNewCollection(): void {
    this.isCreatingNewCollection.set(true);
    this.currentStep.set(2);
  }

  onSortChange(option: SortOption) {
    this.sortOption.set(option);
  }

  changeDisplayView(view: DisplayView): void {
    this.displayView.set(view);
  }

  onActionClick({actionKey, item}:CollectionActionPayload): void {
    switch (actionKey) {
      case CollectionActionType.Publish:
        this.onPublish();
        break;
      case CollectionActionType.Delete:
        this.onDelete(item);
        break;
      default:
        throw new Error(`Неизвестное действие: ${actionKey}`);
    }
  }


  onDelete(value: ISavedGallery): void {
    const updated = this.collections().filter((item) => item.name !== value.name);
    this.collections.set(updated);
    localStorage.setItem(GALLERY_STORAGE_KEY, JSON.stringify(updated));
  }

  onPublish():void{
    this.modalService.open(ShareCollectionModalComponent, {
      data: {
        url: 'http://localhost:4200/show',
      },
    });
  }

  onSelectDate(range: [dayjs.Dayjs, dayjs.Dayjs] | null) {
    this.dateRange.set(range);
  }

  // TODO: удалить, когда подключат бэкенд
  nextStep() {
    this.currentStep.update((step) => {
      const next = step + 1;
      if (next >= 3) {
        this.isCreatingNewCollection.set(false);
        this.router.navigate(['/upload'], {
          state: {
            galleryName: this.galleryName(),
            galleryDate: this.galleryDate(),
          },
        });
      }
      return next;
    });
  }

  // TODO: Раскоментировать, когда подключат бэкенд
  // nextStep() {
  //   if (this.currentStep() === 2) {
  //     if (!this.galleryName().trim() || !this.galleryDate) {
  //       this.errorMessage = 'Пожалуйста, заполните имя и дату коллекции';
  //       return;
  //     }

  //     this.errorMessage = '';
  //     this.isLoading = true;

  //     this.collectionService.createCollection({
  //       name: this.galleryName(),
  //       date: this.galleryDate()
  //     }).pipe(
  //       takeUntilDestroyed(this.destroyRef)
  //     ).subscribe(res => {
  //       this.isLoading = false;
  //       if (res) {
  //         this.collectionId = res.id;
  //         localStorage.setItem('collectionId', this.collectionId);
  //         this.router.navigate(['/upload'], {
  //           queryParams: { collectionId: this.collectionId }
  //         });
  //       }
  //     });

  //   } else {
  //     this.currentStep.update((value) => value + 1);
  //   }
  // }
}
