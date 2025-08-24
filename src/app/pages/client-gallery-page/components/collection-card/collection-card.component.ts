import { DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { NgClickOutsideDirective } from 'ng-click-outside2';
import { catchError, EMPTY, finalize, tap } from 'rxjs';

import { CollectionApiService } from '../../../../api/collection-api.service';
import type { ISavedGallery } from '../../../../gallery-upload/interface/upload-file';
import type { CollectionActionPayload } from '../../models/collection-display.model';
import { CollectionActionType } from '../../models/collection-display.model';
import { CollectionListService } from '../../service/collection-list.service';
import { PublishConfirmDialogComponent } from '../publish-confirm-dialog/publish-confirm-dialog.component';
import { IPublishResponse } from '../../../../interfaces/collection.interface';

@Component({
  selector: 'app-collection-card',
  templateUrl: './collection-card.component.html',
  styleUrls: ['./collection-card.component.scss'],
  imports: [DatePipe, NgClickOutsideDirective, PublishConfirmDialogComponent],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CollectionCardComponent {
  private readonly collectionApiService: CollectionApiService = inject(CollectionApiService);
  readonly collection = input.required<ISavedGallery>();
  readonly action = output<CollectionActionPayload>();
  readonly navigate = output<string>();
  readonly isMenuOpen = signal(false);
  readonly publishResponse = signal<IPublishResponse | null>(null);

  readonly itemCount = computed(
    () => this.collection().imagesCount ?? this.collection().images?.length ?? 0,
  );

  readonly actionType = CollectionActionType;
  private collectionService = inject(CollectionListService);
  readonly isPublishPopupVisible = signal(false);
  readonly publishing = signal(false);

  toggleMenu(): void {
    this.isMenuOpen.update((open) => !open);
  }

  readonly itemWord = computed(() => {
    const count = this.itemCount();
    const abs = Math.abs(count);
    const lastDigit = abs % 10;
    const lastTwo = abs % 100;

    if (lastTwo >= 11 && lastTwo <= 14) return 'элементов';
    if (lastDigit === 1) return 'элемент';
    if (lastDigit >= 2 && lastDigit <= 4) return 'элемента';
    return 'элементов';
  });

  readonly coverImage = computed(() => {
    return this.collection().preview || 'assets/cover.png';
  });

  onClickedOutside(): void {
    this.isMenuOpen.set(false);
  }

  onCardClick(): void {
    this.navigate.emit(this.collection().id);
  }

  onActionClick(actionKey: CollectionActionType): void {
    this.isMenuOpen.set(false);

    if (actionKey === CollectionActionType.Delete) {
      this.collectionService
        .deleteCollection(this.collection().id)
        .pipe(
          tap(() => {
            this.action.emit({ actionKey, item: this.collection() });
          }),
          catchError((err) => {
            console.error('Ошибка при удалении коллекции', err);
            return EMPTY;
          }),
        )
        .subscribe();
    } else {
      this.isPublishPopupVisible.set(true);
      // this.action.emit({ actionKey, item: this.collection() });
    }
  }

  /**
   * Опубликовать коллекцию
   */
  handlePublish(): void {
    if (this.publishing()) return;

    this.publishing.set(true);
    this.collectionApiService
      .publishCollection(this.collection().id)
      .pipe(
        tap((response) => {
          this.publishResponse.set(response); // сохраняем короткую ссылку
          this.action.emit({ actionKey: CollectionActionType.Publish, item: this.collection() });
        }),
        catchError((err) => {
          console.error('Ошибка при публикации коллекции', err);
          return EMPTY;
        }),
        finalize(() => {
          this.publishing.set(false);
          this.isPublishPopupVisible.set(true);
        }),
      )
      .subscribe();
  }

  /**
   * Закрыть попап "Опубликовать коллекцию"
   */
  closePublishPopup(): void {
    this.isPublishPopupVisible.set(false);
    this.publishResponse.set(null);
  }
}
