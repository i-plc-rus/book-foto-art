import { formatDate, NgTemplateOutlet } from '@angular/common';
import { Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import dayjs from 'dayjs';
import { DatePickerModule } from 'primeng/datepicker';

import { environment as env } from '../../../../environments/environment';
import { CollectionApiService } from '../../../api/collection-api.service';
import type { ISavedGallery } from '../../../gallery-upload/interface/upload-file';
import { ModalService } from '../../../shared/service/modal/modal.service';
import { CollectionCardComponent } from '../components/collection-card/collection-card.component';
import { CollectionHeaderComponent } from '../components/collection-header/collection-header.component';
import { CollectionSortComponent } from '../components/collection-sort/collection-sort.component';
import { CollectionTableComponent } from '../components/collection-table/collection-table.component';
import { CollectionViewComponent } from '../components/collection-view/collection-view.component';
import { FilterDateComponent } from '../components/filter-date/filter-date.component';
import { FilterDropdownComponent } from '../components/filter-dropdown/filter-dropdown.component';
import { GalleryLayoutComponent } from '../gallery-layout/gallery-layout.component';
import { ShareCollectionModalComponent } from '../modal/share-collection-modal/share-collection-modal.component';
import type { CollectionActionPayload, DisplayView } from '../models/collection-display.model';
import { CollectionActionType, SortOption } from '../models/collection-display.model';
import { CATEGORY_TAG, EVENT_DATE, EXPIRY_DATE, STARRED, STATUS } from '../models/filter.model';

export type Step2Controls = {
  name: FormControl<string>;
  date: FormControl<Date | null>;
};

export type Step2Form = FormGroup<Step2Controls>;

@Component({
  standalone: true,
  selector: 'app-client-gallery',
  templateUrl: './client-gallery.component.html',
  styleUrls: ['./client-gallery.component.css'],
  imports: [
    FormsModule,
    DatePickerModule,
    CollectionHeaderComponent,
    FilterDropdownComponent,
    FilterDateComponent,
    CollectionSortComponent,
    CollectionViewComponent,
    CollectionCardComponent,
    CollectionTableComponent,
    NgTemplateOutlet,
    GalleryLayoutComponent,
    ReactiveFormsModule,
  ],
  providers: [CollectionApiService],
})
export class ClientGalleryComponent {
  private readonly formBuilder: FormBuilder = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);
  private readonly collectionService: CollectionApiService = inject(CollectionApiService);
  private readonly router = inject(Router);
  private readonly modalService = inject(ModalService);

  isLoading = false;
  isSubmitting = signal(false);
  errorMessage = '';

  readonly formStep2: Step2Form = this.formBuilder.group<Step2Controls>({
    name: this.formBuilder.control('', {
      validators: [Validators.required, Validators.maxLength(200)],
      nonNullable: true,
    }),
    date: this.formBuilder.control<Date | null>(null, {
      validators: [Validators.required],
    }),
  });

  readonly step2Invalid = computed(
    () => this.formStep2.invalid || this.isLoading || this.isSubmitting(),
  );

  readonly STATUS = STATUS;
  readonly EVENT_DATE = EVENT_DATE;
  readonly CATEGORY_TAG = CATEGORY_TAG;
  readonly EXPIRY_DATE = EXPIRY_DATE;
  readonly STARRED = STARRED;
  readonly baseStaticUrl = env.apiUrl;

  readonly currentStep = signal(1);

  readonly sortOption = signal<SortOption>(SortOption.CreatedNew);
  readonly dateRange = signal<[dayjs.Dayjs, dayjs.Dayjs] | null>(null);
  readonly displayView = signal<DisplayView>('grid');
  readonly collections = signal<ISavedGallery[]>([]);
  readonly isCreatingNewCollection = signal(false);
  readonly searchTerm = signal('');

  private readonly sortedCollections = computed(() => {
    const list = [...this.collections()];
    const sort = this.sortOption();

    switch (sort) {
      case SortOption.CreatedNew:
        return list.sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at));
      case SortOption.CreatedOld:
        return list.sort((a, b) => +new Date(a.created_at) - +new Date(b.created_at));
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

  async nextStep(): Promise<void> {
    const step = this.currentStep();

    if (step === 2) {
      this.handleStepTwo();
      return;
    }

    const next = step + 1;
    this.currentStep.set(next);

    if (next >= 3) {
      await this.finalizeWizard();
    }
  }

  async onNavigate(collectionId: string): Promise<void> {
    await this.router
      .navigate(['/upload'], {
        queryParams: { collectionId },
      })
      .catch();
  }

  handleNewCollection(): void {
    this.isCreatingNewCollection.set(true);
    this.currentStep.set(2);
    this.formStep2.reset();
  }

  onSortChange(option: SortOption): void {
    this.sortOption.set(option);
  }

  changeDisplayView(view: DisplayView): void {
    this.displayView.set(view);
  }

  onSelectDate(range: [dayjs.Dayjs, dayjs.Dayjs] | null): void {
    this.dateRange.set(range);
  }

  onActionClick({ actionKey, item }: CollectionActionPayload): void {
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

    this.collectionService
      .getCollectionDelete(item.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.collections.update((list) => list.filter((col) => col.id !== item.id));
        },
        error: (error) => {
          this.errorMessage = 'Ошибка при удалении коллекции';
          console.error('Ошибка удаления:', error);
        },
      });
  }

  onPublish(item: ISavedGallery): void {
    const url = `${window.location.origin}/show/${item.id}`;
    this.modalService.open(ShareCollectionModalComponent, {
      data: { url },
    });
  }

  private loadCollectionsFromAPI(): void {
    this.isLoading = true;
    this.collectionService
      .getCollectionList()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (apiResponse) => {
          const collectionsArray = apiResponse.collections || [];
          const transformedCollections = collectionsArray.map((c: any) => ({
            ...c,
            images: [],
            imagesCount: 0,
            preview: this.baseStaticUrl + c.cover_thumbnail_url,
            createDate: c.created_at,
          }));

          this.collections.set(transformedCollections);
          this.isLoading = false;
        },
      });
  }

  private handleStepTwo(): void {
    this.errorMessage = '';
    this.formStep2.markAllAsTouched();
    if (this.formStep2.invalid) return;
    this.isLoading = true;
    this.isSubmitting.set(true);
    this.createCollectionRequest();
  }

  private createCollectionRequest(): void {
    const name: string = this.formStep2.controls.name.value?.trim();
    const date: Date | null = this.formStep2.controls.date.value;

    this.collectionService
      .createCollection({
        name,
        date: date ? this.formatDateUS(date?.toString()) : null,
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          if (!res) {
            this.isSubmitting.set(false);
            this.isLoading = false;
            return;
          }

          this.isCreatingNewCollection.set(false);

          this.router
            .navigate(['/upload'], { queryParams: { collectionId: res.id } })
            .then(() => {
              this.isSubmitting.set(false);
              this.isLoading = false; // только после успешной навигации
            })
            .catch(() => {
              // Если навигация не удалась — возвращаем UI в валидное состояние
              this.errorMessage = 'Не удалось открыть загрузку. Попробуйте ещё раз.';
              this.isSubmitting.set(false);
              this.isLoading = false;
              this.isCreatingNewCollection.set(true);
            });
        },
        error: () => {
          this.errorMessage = 'Ошибка при создании коллекции';
          this.isSubmitting.set(false);
          this.isLoading = false;
        },
      });
  }

  async finalizeWizard(): Promise<void> {
    const name: string = this.formStep2.controls.name.value?.trim();
    const date: Date | null = this.formStep2.controls.date.value;

    this.isCreatingNewCollection.set(false);
    await this.router
      .navigate(['/upload'], {
        queryParams: {
          galleryName: name,
          galleryDate: date ? this.formatDateUS(date?.toString()) : null,
        },
      })
      .catch();
  }

  formatDateUS(date: string): string {
    return formatDate(date, 'yyyy-MM-dd', 'en-US');
  }

  canContinueStep2(): boolean {
    return !this.formStep2?.invalid;
  }
}
