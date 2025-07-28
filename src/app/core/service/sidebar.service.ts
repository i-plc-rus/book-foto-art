import { Injectable, signal } from '@angular/core';

@Injectable()
export class SidebarService {
  title = signal<string>('Моя галерея');
  date = signal<Date>(new Date());

  setTitle(title: string) {
    this.title.set(title);
  }

  setDate(date: Date) {
    this.date.set(date);
  }
}
