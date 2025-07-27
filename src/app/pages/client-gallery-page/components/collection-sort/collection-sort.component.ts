import { Component, EventEmitter, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
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
  @Output() sortChange = new EventEmitter<SortOption>();

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
