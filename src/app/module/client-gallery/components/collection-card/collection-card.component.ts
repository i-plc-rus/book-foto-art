import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
  signal,
} from '@angular/core';
import { ISavedGallery } from '../../../../gallery-upload/interface/upload-file';
import { DatePipe } from '@angular/common';
import { NgClickOutsideDirective } from 'ng-click-outside2';

@Component({
  selector: 'app-collection-card',
  templateUrl: './collection-card.component.html',
  styleUrls: ['./collection-card.component.scss'],
  imports: [DatePipe, NgClickOutsideDirective],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CollectionCardComponent {
  readonly collection = input.required<ISavedGallery>();
  readonly delete = output<void>();

  readonly isMenuOpen = signal(false);

  readonly itemCount = computed(() => this.collection().images.length);

  toggleMenu() {
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
    const images = this.collection().images;
    if (!images || images.length === 0) return 'assets/cover.png';

    const first = images[0];

    return first.startsWith('data:') ? first : 'assets/cover.png';
  });

  onClickedOutside(): void {
    this.isMenuOpen.set(false);
  }

  onDelete(): void {
    this.isMenuOpen.set(false);
    this.delete.emit();
  }
}
