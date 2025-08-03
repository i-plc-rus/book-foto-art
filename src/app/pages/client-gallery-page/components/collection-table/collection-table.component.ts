import { CommonModule, DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from '@angular/core';
import { ISavedGallery } from '../../../../gallery-upload/interface/upload-file';
import { CollectionMenuComponent } from '../collection-menu/collection-menu.component';
import { CollectionActionPayload } from '../../models/collection-display.model';

@Component({
  selector: 'app-collection-table',
  templateUrl: './collection-table.component.html',
  styleUrls: ['./collection-table.component.scss'],
  imports: [DatePipe, CollectionMenuComponent],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CollectionTableComponent {
  readonly collections = input.required<ISavedGallery[]>();
  readonly action  = output<CollectionActionPayload>();

  readonly collectionWithMeta = computed(() => {
    return this.collections().map((item) => {
      const image = item.images?.[0] || '';
      const fixedImage = image.startsWith('data:') ? image : 'assets/cover.png';

      const count = item.images?.length ?? 0;
      const abs = Math.abs(count);
      const lastDigit = abs % 10;
      const lastTwo = abs % 100;
      let itemWord = 'элементов';

      if (lastTwo < 11 || lastTwo > 14) {
        if (lastDigit === 1) itemWord = 'элемент';
        else if (lastDigit >= 2 && lastDigit <= 4) itemWord = 'элемента';
      }

      return {
        ...item,
        fixedImage,
        itemCount: count,
        itemWord,
      };
    });
  });

  onActionClick({actionKey, item}: CollectionActionPayload): void {
    this.action.emit({ actionKey, item });
  }
}
