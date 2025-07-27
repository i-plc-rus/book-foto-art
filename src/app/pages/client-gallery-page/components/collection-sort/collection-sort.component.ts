import { Component, input, output, signal } from '@angular/core';
import {
  SORT_OPTIONS,
  SortOption,
} from '../../models/collection-display.model';
import { NgClickOutsideDirective } from 'ng-click-outside2';

@Component({
  selector: 'app-sort-dropdown',
  standalone: true,
  imports: [NgClickOutsideDirective],
  templateUrl: './collection-sort.component.html',
  styleUrls: ['./collection-sort.component.scss'],
})
export class CollectionSortComponent {
  readonly sort = input.required<SortOption>();
  readonly sortChange = output<SortOption>();

  readonly options = SORT_OPTIONS;

  isOpen = signal(false);

  toggleDropdown() {
    this.isOpen.update((v) => !v);
  }

  closeDropdown() {
    this.isOpen.set(false);
  }

  choose(option: SortOption) {
    this.sortChange.emit(option);
    this.closeDropdown();
  }
}
