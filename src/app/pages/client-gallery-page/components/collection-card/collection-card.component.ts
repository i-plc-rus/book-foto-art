import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';
import { NgClickOutsideDirective } from 'ng-click-outside2';
import { Toast } from 'primeng/toast';

import type { ISavedGallery } from '../../../../gallery-upload/interface/upload-file';
import type { CollectionActionPayload } from '../../models/collection-display.model';
import { CollectionActionType } from '../../models/collection-display.model';

@Component({
  selector: 'app-collection-card',
  templateUrl: './collection-card.component.html',
  styleUrls: ['./collection-card.component.scss'],
  imports: [DatePipe, NgClickOutsideDirective, Toast],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CollectionCardComponent {
  readonly collection = input.required<ISavedGallery>();
  readonly action = output<CollectionActionPayload>();
  readonly navigate = output<string>();
  readonly unpublishing = input<boolean>(false);
  readonly isMenuOpen = signal(false);

  readonly itemCount = computed(() => this.collection().count_photos ?? 0);

  readonly actionType = CollectionActionType;

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

  /**
   * Выбрана опция в выпадающем списке
   * @param actionKey опция
   */
  onActionClick(actionKey: CollectionActionType): void {
    this.isMenuOpen.set(false);
    this.action.emit({ actionKey, item: this.collection() });
  }
}
