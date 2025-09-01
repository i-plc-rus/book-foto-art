import { formatDate, NgTemplateOutlet } from '@angular/common';
import { Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import type { FormControl, FormGroup } from '@angular/forms';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import dayjs from 'dayjs';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { DatePickerModule } from 'primeng/datepicker';
import { InputText } from 'primeng/inputtext';
import { Skeleton } from 'primeng/skeleton';
import { catchError, EMPTY, finalize, tap } from 'rxjs';

import { CollectionApiService } from '../../../api/collection-api.service';
import type { ISavedGallery } from '../../../gallery-upload/interface/upload-file';
import type { IPublishResponse } from '../../../interfaces/collection.interface';
import { ModalService } from '../../../shared/service/modal/modal.service';
import { CollectionCardComponent } from '../components/collection-card/collection-card.component';
import { CollectionHeaderComponent } from '../components/collection-header/collection-header.component';
import { CollectionSortComponent } from '../components/collection-sort/collection-sort.component';
import { CollectionTableComponent } from '../components/collection-table/collection-table.component';
import { CollectionViewComponent } from '../components/collection-view/collection-view.component';
import { FilterDateComponent } from '../components/filter-date/filter-date.component';
import { FilterDropdownComponent } from '../components/filter-dropdown/filter-dropdown.component';
import { PublishConfirmDialogComponent } from '../components/publish-confirm-dialog/publish-confirm-dialog.component';
import { GalleryLayoutComponent } from '../gallery-layout/gallery-layout.component';
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
    InputText,
    PublishConfirmDialogComponent,
    ConfirmDialog,
    Skeleton,
  ],
  providers: [CollectionApiService, MessageService],
})
export class ClientGalleryComponent {
  private readonly formBuilder: FormBuilder = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);
  private readonly messageService: MessageService = inject(MessageService);
  private readonly collectionApiService: CollectionApiService = inject(CollectionApiService);
  private readonly confirmation = inject(ConfirmationService);
  private readonly router = inject(Router);
  private readonly modalService = inject(ModalService);
  readonly isPublishPopupVisible = signal(false);
  readonly publishing = signal(false);
  readonly unpublishing = signal(false);
  readonly publishResponse = signal<IPublishResponse | null>(null);
  readonly actionCollection = signal<ISavedGallery | null>(null);
  private deleting = signal(false);

  isLoading = false;
  isSubmitting = signal(false);
  errorMessage = '';
  skeletons = Array.from({ length: 8 });

  readonly formStep2: Step2Form = this.formBuilder.group<Step2Controls>({
    name: this.formBuilder.control('', {
      validators: [Validators.required, Validators.maxLength(200)],
      nonNullable: true,
    }),
    date: this.formBuilder.control<Date | null>(null, {
      validators: [Validators.required],
    }),
  });

  readonly STATUS = STATUS;
  readonly EVENT_DATE = EVENT_DATE;
  readonly CATEGORY_TAG = CATEGORY_TAG;
  readonly EXPIRY_DATE = EXPIRY_DATE;
  readonly STARRED = STARRED;

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
      this.formStep2.disable();
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

  /**
   * Выбрана опция в выпадающем списке
   * @param actionKey опция
   * @param item коллекция
   */
  onActionClick({ actionKey, item }: CollectionActionPayload): void {
    switch (actionKey) {
      case CollectionActionType.CopyLink:
        this.copyLink(item);
        break;
      case CollectionActionType.Publish:
        this.onPublish(item);
        break;
      case CollectionActionType.Unpublish:
        this.onUnpublish(item);
        break;
      case CollectionActionType.Delete:
        this.onDelete(item);
        break;
      default:
        throw new Error(`Неизвестное действие: ${actionKey}`);
    }
  }

  /**
   * Удалить коллекцию (с подтверждением)
   */
  onDelete(item: ISavedGallery): void {
    if (!item.id) return;

    this.confirmation.confirm({
      key: 'deleteCollection',
      header: 'Удалить коллекцию?',
      message: `Вы действительно хотите удалить «${item.name}»? Действие необратимо.`,
      rejectButtonProps: {
        label: 'Отмена',
        severity: 'secondary',
        text: true, // остаётся прозрачной
      },
      acceptButtonProps: {
        label: 'Удалить',
        text: false,
        outlined: false,
        link: false,
        styleClass: 'force-solid',
      },
      icon: 'pi pi-exclamation-triangle',
      accept: () => this.doDeleteCollection(item.id),
    });
  }

  private doDeleteCollection(collectionId: string): void {
    this.collectionApiService
      .deleteCollection(collectionId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Удалено',
            detail: 'Коллекция удалена',
            life: 2000,
          });
          this.handleActionFinished();
        },
        error: (error) => {
          console.error('Ошибка удаления коллекции:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Ошибка',
            detail: 'Не удалось удалить коллекцию',
            life: 3000,
          });
          this.isLoading = false;
        },
      });
  }

  /**
   * Опубликовать коллекцию
   * @param item коллекция
   */
  onPublish(item: ISavedGallery): void {
    this.actionCollection.set(item);
    this.isPublishPopupVisible.set(true);
  }

  private loadCollectionsFromAPI(): void {
    this.isLoading = true;
    this.collectionApiService
      .getCollectionList()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (apiResponse) => {
          const collectionsArray = apiResponse.collections || [];
          const transformedCollections = collectionsArray.map((c: any) => ({
            ...c,
            images: [],
            imagesCount: 0,
            preview: c.cover_thumbnail_url,
            createDate: c.created_at,
            is_published: c.is_published,
            short_link_url: c.short_link_url ?? null,
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

    this.collectionApiService
      .createCollection({
        name,
        date: date ? this.formatDateUS(date) : null,
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
          galleryDate: date ? this.formatDateUS(date) : null,
        },
      })
      .catch();
  }

  formatDateUS(date: Date): string {
    return formatDate(date, 'yyyy-MM-dd', 'en-US');
  }

  /**
   * После действия над коллекцией обновить инфо на странице
   */
  handleActionFinished(): void {
    this.loadCollectionsFromAPI();
  }

  /**
   * Опубликовать коллекцию
   */
  handlePublish(): void {
    if (this.publishing()) return;
    this.publishing.set(true);
    this.isLoading = true;
    this.collectionApiService
      .publishCollection(this.actionCollection()!.id)
      .pipe(
        tap((response) => {
          this.publishResponse.set(response); // сохраняем короткую ссылку
          this.messageService.add({
            severity: 'success',
            summary: 'Опубликовано',
            detail: 'Галерея опубликована',
            life: 2000,
          });
        }),
        tap(() => this.handleActionFinished()),
        catchError((err) => {
          console.error('Ошибка при публикации коллекции', err);
          this.isLoading = false;
          return EMPTY;
        }),
        finalize(() => {
          this.publishing.set(false);
          this.isPublishPopupVisible.set(true);
          this.actionCollection.set(null);
        }),
      )
      .subscribe();
  }

  /**
   * Закрыть попап "Опубликовать коллекцию"
   */
  closePublishPopup(): void {
    this.isPublishPopupVisible.set(false);
  }

  onPopupHide(): void {
    this.publishResponse.set(null);
  }

  /**
   * Снять с публикации
   * @param collection коллекция
   */
  onUnpublish(collection: ISavedGallery): void {
    if (this.unpublishing()) return;
    this.unpublishing.set(true);
    this.isLoading = true;
    this.collectionApiService
      .unpublishCollection(collection.id)
      .pipe(
        tap(() => {
          // тостер успеха
          this.messageService.add({
            severity: 'success',
            summary: 'Снято с публикации',
            detail: 'Галерея больше не опубликована',
            life: 2500,
          });
        }),
        tap(() => this.handleActionFinished()),
        catchError((err) => {
          console.error('Ошибка при снятии публикации коллекции', err);
          this.messageService.add({
            severity: 'error',
            summary: 'Ошибка',
            detail: 'Не удалось снять публикацию',
            life: 3000,
          });
          this.isLoading = false;
          return EMPTY;
        }),
        finalize(() => this.unpublishing.set(false)),
      )
      .subscribe();
  }

  private async copyLink(item: ISavedGallery): Promise<void> {
    const url = item.short_link_url;
    if (!url) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Нет ссылки',
        detail: 'Коллекция не опубликована',
        life: 2000,
      });
      return;
    }

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(url);
      } else {
        // Фолбэк для несекьюрных контекстов
        const textarea = document.createElement('textarea');
        textarea.value = url;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        textarea.remove();
      }
      this.messageService.add({
        severity: 'success',
        summary: 'Ссылка скопирована',
        detail: url,
        life: 1500,
      });
    } catch (e) {
      console.error('Clipboard error', e);
      this.messageService.add({
        severity: 'error',
        summary: 'Не удалось скопировать',
        detail: 'Скопируйте ссылку вручную',
        life: 2500,
      });
    }
  }
}
