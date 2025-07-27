import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  computed,
  effect,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import dayjs from 'dayjs';
import { FilterConfig } from '../../models/filter.model';

@Component({
  selector: 'app-filter-date',
  standalone: true,
  imports: [FormsModule, NgxDaterangepickerMd],
  templateUrl: './filter-date.component.html',
  styleUrls: ['./filter-date.component.scss'],
})
export class FilterDateComponent implements OnInit, OnDestroy {
  readonly config = input.required<FilterConfig>();
  readonly onSelect = output<[dayjs.Dayjs, dayjs.Dayjs] | null>();

  readonly isOpen = signal(false);
  readonly startDate = signal<Date | null>(null);
  readonly endDate = signal<Date | null>(null);

  private readonly elementRef = inject(ElementRef);

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

  ngOnInit() {
    document.addEventListener('click', this.handleClickOutside);
  }

  ngOnDestroy() {
    document.removeEventListener('click', this.handleClickOutside);
  }

  private handleClickOutside = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    if (!this.elementRef.nativeElement.contains(target)) {
      this.isOpen.set(false);
    }
  };

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

    // Передаём Dayjs-объекты напрямую
    this.onSelect.emit([start, end]);

    this.isOpen.set(false);
  }
}
