import { Component, signal, inject, computed, DestroyRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CollectionHeaderComponent } from '../components/collection-header/collection-header.component';
import { FilterDropdownComponent } from '../components/filter-dropdown/filter-dropdown.component';
import {
  CATEGORY_TAG,
  EVENT_DATE,
  EXPIRY_DATE,
  STARRED,
  STATUS,
} from '../models/filter.model';
import { FilterDateComponent } from '../components/filter-date/filter-date.component';
import { CollectionActionPayload, CollectionActionType, DisplayView, SortOption } from '../models/collection-display.model';
import { ISavedGallery } from '../../../gallery-upload/interface/upload-file';
import { NgTemplateOutlet } from '@angular/common';
import { CollectionSortComponent } from '../components/collection-sort/collection-sort.component';
import { CollectionViewComponent } from '../components/collection-view/collection-view.component';
import { CollectionTableComponent } from '../components/collection-table/collection-table.component';
import { CollectionCardComponent } from '../components/collection-card/collection-card.component';
import dayjs from 'dayjs';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {CollectionService} from '../../../core/service/collection.service.service';
import { ShareCollectionModalComponent } from '../modal/share-collection-modal/share-collection-modal.component';
import { ModalService } from '../../../shared/service/modal/modal.service';
import {environment as env} from '../../../../environments/environment';
import {GalleryLayoutComponent} from '../gallery-layout/gallery-layout.component';

@Component({
  standalone: true,
  selector: 'app-client-gallery',
  templateUrl: './client-gallery.component.html',
  styleUrls: ['./client-gallery.component.css'],
  imports: [
    FormsModule,
    CollectionHeaderComponent,
    FilterDropdownComponent,
    FilterDateComponent,
    CollectionSortComponent,
    CollectionViewComponent,
    CollectionCardComponent,
    CollectionTableComponent,
    NgTemplateOutlet,
    GalleryLayoutComponent
  ],
  providers: [CollectionService]
})
export class ClientGalleryComponent {
  isLoading = false;
  errorMessage = '';
  collectionId: string | undefined;

  readonly STATUS = STATUS;
  readonly EVENT_DATE = EVENT_DATE;
  readonly CATEGORY_TAG = CATEGORY_TAG;
  readonly EXPIRY_DATE = EXPIRY_DATE;
  readonly STARRED = STARRED;
  readonly baseStaticUrl = env.apiUrl;

  readonly currentStep = signal(1);
  readonly galleryName = signal('');
  readonly galleryDate = signal('');

  readonly sortOption = signal<SortOption>(SortOption.CreatedNew);
  readonly dateRange = signal<[dayjs.Dayjs, dayjs.Dayjs] | null>(null);
  readonly displayView = signal<DisplayView>('grid');
  readonly collections = signal<ISavedGallery[]>([]);
  readonly isCreatingNewCollection = signal(false);
  readonly searchTerm = signal('');

  private readonly destroyRef = inject(DestroyRef);
  private readonly collectionService = inject(CollectionService);
  private readonly router = inject(Router);
  private readonly modalService = inject(ModalService)

  private readonly sortedCollections = computed(() => {
    const list = [...this.collections()];
    const sort = this.sortOption();

    switch (sort) {
      case SortOption.CreatedNew:
        return list.sort(
          (a, b) => +new Date(b.created_at) - +new Date(a.created_at)
        );
      case SortOption.CreatedOld:
        return list.sort(
          (a, b) => +new Date(a.created_at) - +new Date(b.created_at)
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
        (dayjs(item.date).isAfter(range[0].subtract(1, 'day')) &&
          dayjs(item.date).isBefore(range[1].add(1, 'day')));

      return nameMatch && dateMatch;
    });
  });

  readonly isGalleryEmpty = computed(() => this.collections().length === 0);

  constructor() {
    this.loadCollectionsFromAPI();
  }

  nextStep(): void {
    const step = this.currentStep();

    if (step === 2) {
      this.handleStepTwo();
      return;
    }

    const next = step + 1;
    this.currentStep.set(next);

    if (next >= 3) {
      this.finalizeWizard();
    }
  }

  onNavigate(collectionId: string): void {
    this.router.navigate(['/upload'], {
      queryParams: { collectionId }
    }).catch();
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

  onSelectDate(range: [dayjs.Dayjs, dayjs.Dayjs] | null) {
    this.dateRange.set(range);
  }

  onActionClick({actionKey, item}: CollectionActionPayload): void {
    switch (actionKey) {
      case CollectionActionType.Publish:
        this.onPublish(item);
        break;
      case CollectionActionType.Delete:
        this.onDelete(item);
        break;
      default:
        throw new Error(`Неизвестное действие: ${actionKey}`);
    }
  }

  onDelete(item: ISavedGallery): void {
    if (!item.id) return;

    this.collectionService.getCollectionDelete(item.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.collections.update(list => list.filter(col => col.id !== item.id));
        },
        error: (error) => {
          this.errorMessage = 'Ошибка при удалении коллекции';
          console.error('Ошибка удаления:', error);
        }
      });
  }

  onPublish(item: ISavedGallery): void {
    this.modalService.open(ShareCollectionModalComponent, {
      data: {
        url: `http://localhost:4200/show/${item.id}`,
      },
    });
  }

  private loadCollectionsFromAPI(): void {
    this.isLoading = true;
    this.collectionService.getCollection()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (apiResponse) => {
          console.log('API Response:', apiResponse); // Логируем ответ
          const collectionsArray = apiResponse.collections || [];
          console.log('Collections array:', collectionsArray); // Логируем массив

          const transformedCollections = collectionsArray.map((c: any) => ({
            ...c,
            images: [],
            imagesCount: 0,
            preview: this.baseStaticUrl + c.cover_thumbnail_url,
            createDate: c.created_at
          }));

          console.log('Transformed collections:', transformedCollections); // Логируем преобразованные данные
          this.collections.set(transformedCollections);
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading collections:', error); // Логируем ошибку
          this.errorMessage = 'Ошибка загрузки коллекций';
          this.isLoading = false;
        }
      });
  }

  private handleStepTwo(): void {
    this.errorMessage = '';
    this.isLoading = true;

    this.createCollectionRequest();
  }

  private createCollectionRequest(): void {
    this.collectionService.createCollection({
      name: this.galleryName(),
      date: this.galleryDate()
    }).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res) {
          this.router.navigate(['/upload'], {
            queryParams: { collectionId: res.id }
          }).catch();
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = 'Ошибка при создании коллекции';
        console.error('Create collection error:', err);
      }
    });
  }

  private finalizeWizard(): void {
    this.isCreatingNewCollection.set(false);
    this.router.navigate(['/upload'], {
      queryParams: {
        galleryName: this.galleryName(),
        galleryDate: this.galleryDate()
      }
    }).catch();
  }
}
