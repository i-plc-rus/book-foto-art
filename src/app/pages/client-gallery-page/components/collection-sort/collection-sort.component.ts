import { Component, input, output, signal } from '@angular/core';
import {
  SORT_OPTIONS,
  SortOption,
} from '../../models/collection-display.model';
import { SortComponent } from '../../../../shared/components/sort/sort.component';

@Component({
  selector: 'app-sort-dropdown',
  standalone: true,
  imports: [SortComponent],
  templateUrl: './collection-sort.component.html',
})
export class CollectionSortComponent {
  readonly sort = input.required<SortOption>();
  readonly sortChange = output<SortOption>();

  readonly options = SORT_OPTIONS;

  choose(option: SortOption) {
    this.sortChange.emit(option);
  }
}
