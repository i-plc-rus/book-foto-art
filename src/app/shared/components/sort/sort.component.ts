import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
  signal,
} from '@angular/core';
import { NgClickOutsideDirective } from 'ng-click-outside2';

interface SortItem<T = unknown> {
  label: string;
  value: T;
}

@Component({
  selector: 'app-sort',
  templateUrl: './sort.component.html',
  styleUrls: ['./sort.component.scss'],
  imports: [NgClickOutsideDirective],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SortComponent<T = unknown> {
  readonly sort = input.required<T>();
  readonly options = input.required<SortItem<T>[]>();
  readonly sortChange = output<T>();

  isOpen = signal(false);

  toggleDropdown() {
    this.isOpen.update((v) => !v);
  }

  closeDropdown() {
    this.isOpen.set(false);
  }

  choose(option: T) {
    this.sortChange.emit(option);
    this.closeDropdown();
  }
}
