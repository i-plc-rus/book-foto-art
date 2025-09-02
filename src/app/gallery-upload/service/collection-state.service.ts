import { Injectable, signal } from '@angular/core';
import type { Observable } from 'rxjs';
import { Subject } from 'rxjs';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CollectionStateService {
  readonly title = signal<string>('Моя галерея');
  readonly date = signal<Date>(new Date());
  readonly coverUrl = signal<string | null>(null);
  readonly coverUpdated$ = new Subject<{ collectionId: string; cover_url: string }>();

  private currentCollectionId = new BehaviorSubject<string | null>(
    localStorage.getItem('currentCollectionId'),
  );

  setCollectionData(data: { title: string; date: Date; coverUrl: string }): void {
    this.title.set(data.title);
    this.date.set(data.date);
    this.coverUrl.set(data.coverUrl);
  }

  setCurrentCollectionId(id: string | null): void {
    if (id) {
      localStorage.setItem('currentCollectionId', id);
    } else {
      localStorage.removeItem('currentCollectionId');
    }
    this.currentCollectionId.next(id);
  }

  getCurrentCollectionId(): Observable<string | null> {
    return this.currentCollectionId.asObservable();
  }

  getCurrentCollectionIdValue(): string | null {
    return this.currentCollectionId.value;
  }

  notifyCoverUpdated(collectionId: string, cover_url: string): void {
    this.coverUpdated$.next({ collectionId, cover_url });
  }
}
