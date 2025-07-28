import {
  Component,
  computed,
  effect,
  input,
  output,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import dayjs from 'dayjs';
import { FilterConfig } from '../../models/filter.model';
import { NgClickOutsideDirective } from 'ng-click-outside2';
import { RangeCalendarComponent } from '../../../../shared/components/range-calendar/range-calendar.component';

@Component({
  selector: 'app-filter-date',
  standalone: true,
  imports: [
    FormsModule,
    NgxDaterangepickerMd,
    NgClickOutsideDirective,
    RangeCalendarComponent,
  ],
  templateUrl: './filter-date.component.html',
  styleUrls: ['./filter-date.component.scss'],
})
export class FilterDateComponent {
  readonly config = input.required<FilterConfig>();
  readonly disabled = input(false);
  readonly onSelect = output<[dayjs.Dayjs, dayjs.Dayjs] | null>();

  readonly isOpen = signal(false);
  readonly startDate = signal<Date | null>(null);
  readonly endDate = signal<Date | null>(null);

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

  constructor() {
    effect(() => {
      const start = this.startDate();
      const end = this.endDate();
      if (start && end) {
        this.onSelect.emit([dayjs(start), dayjs(end)]);
      }
    });
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
