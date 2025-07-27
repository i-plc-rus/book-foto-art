import { Component, signal, inject, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CollectionHeaderComponent } from '../components/collection-header/collection-header.component';
import { FilterDropdownComponent } from '../components/filter-dropdown/filter-dropdown.component';
import {
  CATEGORY_TAG,
  EVENT_DATE,
  EXPIRY_DATE,
  STARRED,
  STATUS,
} from '../models/filter.model';
import { FilterDateComponent } from '../components/filter-date/filter-date.component';
import { DisplayView, SortOption } from '../models/collection-display.model';
import {
  GALLERY_STORAGE_KEY,
  ISavedGallery,
} from '../../../gallery-upload/interface/upload-file';
import { NgTemplateOutlet } from '@angular/common';
import { CollectionSortComponent } from '../components/collection-sort/collection-sort.component';
import { CollectionViewComponent } from '../components/collection-view/collection-view.component';
import { CollectionTableComponent } from '../components/collection-table/collection-table.component';
import { CollectionCardComponent } from '../components/collection-card/collection-card.component';
import dayjs from 'dayjs';

@Component({
  selector: 'app-client-gallery',
  standalone: true,
  imports: [
    FormsModule,
    CollectionHeaderComponent,
    FilterDropdownComponent,
    FilterDateComponent,
    CollectionSortComponent,
    CollectionViewComponent,
    CollectionCardComponent,
    CollectionTableComponent,
    NgTemplateOutlet,
  ],
  templateUrl: './client-gallery.component.html',
  styleUrls: ['./client-gallery.component.css'],
})
export class ClientGalleryComponent {
  private readonly router = inject(Router);

  readonly STATUS = STATUS;
  readonly EVENT_DATE = EVENT_DATE;
  readonly CATEGORY_TAG = CATEGORY_TAG;
  readonly EXPIRY_DATE = EXPIRY_DATE;
  readonly STARRED = STARRED;

  readonly currentStep = signal(1);
  readonly galleryName = signal('');
  readonly galleryDate = signal('');

  readonly sortOption = signal<SortOption>('created-new');
  readonly dateRange = signal<[dayjs.Dayjs, dayjs.Dayjs] | null>(null);
  readonly displayView = signal<DisplayView>('grid');
  readonly collections = signal<ISavedGallery[]>([]);
  readonly isCreatingNewCollection = signal(false);
  readonly searchTerm = signal('');

  private readonly sortedCollections = computed(() => {
    const list = [...this.collections()];
    return list.sort((a, b) => {
      const sort = this.sortOption();
      switch (sort) {
        case 'created-new':
          return +new Date(b.createDate) - +new Date(a.createDate);
        case 'created-old':
          return +new Date(a.createDate) - +new Date(b.createDate);
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        default:
          return 0;
      }
    });
  });

  readonly filteredCollections = computed(() => {
    const term = this.searchTerm().toLowerCase();
    const range = this.dateRange();
    const list = this.sortedCollections();

    return list.filter((item) => {
      const nameMatch = !term || item.name.toLowerCase().includes(term);

      const dateMatch =
        !range ||
        (dayjs(item.createDate).isAfter(range[0].subtract(1, 'day')) &&
          dayjs(item.createDate).isBefore(range[1].add(1, 'day')));

      return nameMatch && dateMatch;
    });
  });

  readonly isGalleryEmpty = computed(() => !!this.collections().length);

  constructor() {
    this.loadCollectionsFromStorage();
  }

  private loadCollectionsFromStorage(): void {
    const raw = localStorage.getItem(GALLERY_STORAGE_KEY);
    if (!raw) return;

    try {
      const parsed = JSON.parse(raw) as ISavedGallery[];
      if (Array.isArray(parsed)) {
        this.collections.set(parsed);
      }
    } catch (error) {
      console.error('Invalid JSON in localStorage for savedGalleries:', error);
    }
  }

  nextStep() {
    this.currentStep.update((step) => {
      const next = step + 1;
      if (next >= 3) {
        this.isCreatingNewCollection.set(false);
        this.router.navigate(['/upload'], {
          state: {
            galleryName: this.galleryName(),
            galleryDate: this.galleryDate(),
          },
        });
      }
      return next;
    });
  }

  goBack() {
    this.currentStep.update((step) => Math.max(1, step - 1));
  }

  handleNewCollection(): void {
    this.isCreatingNewCollection.set(true);
    this.currentStep.set(2);
  }

  onSortChange(option: SortOption) {
    this.sortOption.set(option);
  }

  changeDisplayView(view: DisplayView): void {
    this.displayView.set(view);
  }

  onDelete(name: string): void {
    const updated = this.collections().filter((item) => item.name !== name);
    this.collections.set(updated);
    localStorage.setItem(GALLERY_STORAGE_KEY, JSON.stringify(updated));
  }

  onSelectDate(range: [dayjs.Dayjs, dayjs.Dayjs] | null) {
    this.dateRange.set(range);
  }
}
