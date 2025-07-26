import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  computed,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FilterConfig } from '../../models/filter.model';

@Component({
  selector: 'app-filter-date',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './filter-date.component.html',
  styleUrls: ['./filter-date.component.scss'],
})
export class FilterDateComponent implements OnInit, OnDestroy {
  readonly config = input.required<FilterConfig>();
  readonly onSelect = output<[string, string] | null>();

  readonly isOpen = signal(false);
  readonly startDate = signal<Date | null>(null);
  readonly endDate = signal<Date | null>(null);

  private readonly elementRef = inject(ElementRef);
  private readonly clickHandler = this.handleClickOutside.bind(this);

  readonly summary = computed(() => {
    const start = this.startDate();
    const end = this.endDate();
    if (!start || !end) return this.config().label;

    const format = (d: Date) =>
      d.toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });

    return `${this.config().label}: ${format(start)} – ${format(end)}`;
  });

  ngOnInit() {
    document.addEventListener('click', this.clickHandler);
  }

  ngOnDestroy() {
    document.removeEventListener('click', this.clickHandler);
  }

  private handleClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!this.elementRef.nativeElement.contains(target)) {
      this.isOpen.set(false);
    }
  }

  toggle() {
    this.isOpen.update((v) => !v);
  }

  clear(event: MouseEvent) {
    event.stopPropagation();
    this.startDate.set(null);
    this.endDate.set(null);
    this.onSelect.emit(null);
  }
}
