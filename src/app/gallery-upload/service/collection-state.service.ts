import { Injectable, signal } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class CollectionStateService {
  readonly title = signal<string>('Моя галерея');
  readonly date = signal<Date>(new Date());
  readonly coverUrl = signal<string | null>(null);

  private currentCollectionId = new BehaviorSubject<string | null>(
    localStorage.getItem('currentCollectionId')
  );

  setCollectionData(data: { title: string; date: Date; coverUrl: string }) {
    this.title.set(data.title);
    this.date.set(data.date);
    this.coverUrl.set(data.coverUrl);
  }

  setCurrentCollectionId(id: string | null) {
    if (id) {
      localStorage.setItem('currentCollectionId', id);
    } else {
      localStorage.removeItem('currentCollectionId');
    }
    this.currentCollectionId.next(id);
  }

  getCurrentCollectionId() {
    return this.currentCollectionId.asObservable();
  }

  getCurrentCollectionIdValue(): string | null {
    return this.currentCollectionId.value;
  }
}
