import { Component, computed, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import dayjs from 'dayjs';
import { FilterConfig } from '../../models/filter.model';
import { NgClickOutsideDirective } from 'ng-click-outside2';

@Component({
  selector: 'app-filter-date',
  standalone: true,
  imports: [FormsModule, NgxDaterangepickerMd, NgClickOutsideDirective],
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

  readonly locale = {
    applyLabel: 'Выбрать',
    format: 'DD.MM.YYYY',
    daysOfWeek: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
    monthNames: [
      'Янв',
      'Фев',
      'Мар',
      'Апр',
      'Май',
      'Июн',
      'Июл',
      'Авг',
      'Сен',
      'Окт',
      'Ноя',
      'Дек',
    ],
    firstDay: 1,
  };

  readonly start = computed(() =>
    this.startDate() ? dayjs(this.startDate()!) : dayjs()
  );

  readonly end = computed(() =>
    this.endDate() ? dayjs(this.endDate()!) : dayjs()
  );

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

  toggle() {
    this.isOpen.update((v) => !v);
  }

  clear(event: MouseEvent) {
    event.stopPropagation();
    this.startDate.set(null);
    this.endDate.set(null);
    this.onSelect.emit(null);
  }

  choosedDate(event: { startDate: dayjs.Dayjs; endDate: dayjs.Dayjs }): void {
    const start = event.startDate.startOf('day');
    const end = event.endDate.startOf('day');
    if (!start || !end) return;

    this.startDate.set(start.toDate());
    this.endDate.set(end.toDate());
    this.onSelect.emit([start, end]);

    this.isOpen.set(false);
  }
}
