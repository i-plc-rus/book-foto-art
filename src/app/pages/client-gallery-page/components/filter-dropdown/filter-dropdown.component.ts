import { Component, signal, input, output, computed } from '@angular/core';
import { FilterConfig } from '../../models/filter.model';
import { NgClickOutsideDirective } from 'ng-click-outside2';

@Component({
  selector: 'app-filter-dropdown',
  templateUrl: './filter-dropdown.component.html',
  styleUrls: ['./filter-dropdown.component.scss'],
  imports: [NgClickOutsideDirective],
  standalone: true,
})
export class FilterDropdownComponent {
  readonly config = input.required<FilterConfig>();
  readonly disabled = input(false);
  readonly onSelect = output<string[]>();

  readonly isOpen = signal(false);
  readonly selected = signal<string[]>([]);

  readonly summary = computed(() => {
    const selected = this.selected();
    if (!selected.length) return this.config().label;

    const visible = selected.slice(0, 2).join(', ');
    const extra = selected.length > 2 ? `, +${selected.length - 2}` : '';
    return `${this.config().label}: ${visible}${extra}`;
  });

  toggle() {
    this.isOpen.update((v) => !v);
  }

  choose(option: string) {
    const current = this.selected();
    const isMultiple = this.config().selection === 'multiple';

    if (isMultiple) {
      const exists = current.includes(option);
      const updated = exists
        ? current.filter((o) => o !== option)
        : [...current, option];

      this.selected.set(updated);
      this.onSelect.emit(updated);
    } else {
      const updated = current.includes(option) ? [] : [option];
      this.selected.set(updated);
      this.onSelect.emit(updated);
      this.isOpen.set(false);
    }
  }

  clear(event: MouseEvent) {
    event.stopPropagation();
    this.selected.set([]);
    this.onSelect.emit([]);
  }
}
