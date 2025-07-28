import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import {
  SORT_OPTIONS,
  SortOption,
} from '../../models/collection-display.model';
import { SortComponent } from '../../../../shared/components/sort/sort.component';

@Component({
  selector: 'app-sort-dropdown',
  imports: [SortComponent],
  templateUrl: './collection-sort.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CollectionSortComponent {
  readonly sort = input.required<SortOption>();
  readonly sortChange = output<SortOption>();

  readonly options = SORT_OPTIONS;

  choose(option: SortOption) {
    this.sortChange.emit(option);
  }
}
