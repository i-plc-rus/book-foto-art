import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  model,
} from '@angular/core';
import dayjs from 'dayjs';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';

@Component({
  selector: 'app-range-calendar',
  templateUrl: './range-calendar.component.html',
  styleUrls: ['./range-calendar.component.scss'],
  imports: [NgxDaterangepickerMd],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RangeCalendarComponent {
  readonly startDate = model<Date | null>(null);
  readonly endDate = model<Date | null>(null);
  readonly isOpen = model<boolean>(false);

  readonly start = computed(() =>
    this.startDate() ? dayjs(this.startDate()!) : dayjs()
  );

  readonly end = computed(() =>
    this.endDate() ? dayjs(this.endDate()!) : dayjs()
  );

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

  choosedDate(event: { startDate: dayjs.Dayjs; endDate: dayjs.Dayjs }): void {
    console.log('here');
    const start = event.startDate.startOf('day');
    const end = event.endDate.startOf('day');
    if (!start || !end) return;

    this.startDate.set(start.toDate());
    this.endDate.set(end.toDate());
    this.isOpen.set(false);
  }
}
