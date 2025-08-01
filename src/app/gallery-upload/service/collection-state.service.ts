import {Injectable, signal} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable()
export class CollectionStateService {
  private currentCollectionId = new BehaviorSubject<string | null>(
    localStorage.getItem('currentCollectionId')
  );
  readonly coverUrl = signal<string | null>(null);

  setCoverUrl(url: string) {
    this.coverUrl.set(url);
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
}
