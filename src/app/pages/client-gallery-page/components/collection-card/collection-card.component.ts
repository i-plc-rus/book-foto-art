import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { ISavedGallery } from '../../../../gallery-upload/interface/upload-file';
import { DatePipe } from '@angular/common';
import { NgClickOutsideDirective } from 'ng-click-outside2';
import {
  CollectionActionPayload,
  CollectionActionType,
} from '../../models/collection-display.model';
import { CollectionListService } from '../../service/collection-list.service';
import { catchError, EMPTY, tap } from 'rxjs';
import { PublishConfirmDialogComponent } from '../publish-confirm-dialog/publish-confirm-dialog.component';

@Component({
  selector: 'app-collection-card',
  templateUrl: './collection-card.component.html',
  styleUrls: ['./collection-card.component.scss'],
  imports: [DatePipe, NgClickOutsideDirective, PublishConfirmDialogComponent],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CollectionCardComponent {
  readonly collection = input.required<ISavedGallery>();
  readonly action = output<CollectionActionPayload>();
  readonly navigate = output<string>();
  readonly isMenuOpen = signal(false);

  readonly itemCount = computed(
    () => this.collection().imagesCount ?? this.collection().images?.length ?? 0,
  );

  readonly actionType = CollectionActionType;
  private collectionService = inject(CollectionListService);
  isPublishPopupVisible: boolean = false;

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
      this.isPublishPopupVisible = true;
      // this.action.emit({ actionKey, item: this.collection() });
    }
  }

  /**
   * Опубликовать коллекцию
   */
  handlePublish(): void {
    this.closePublishPopup();
  }

  /**
   * Закрыть попап "Опубликовать коллекцию"
   */
  closePublishPopup(): void {
    this.isPublishPopupVisible = false;
  }
}
