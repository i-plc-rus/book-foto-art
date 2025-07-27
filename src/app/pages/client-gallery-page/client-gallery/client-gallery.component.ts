import { Component, signal, inject, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CollectionHeaderComponent } from '../components/collection-header/collection-header.component';
import { FilterDropdownComponent } from '../components/filter-dropdown/filter-dropdown.component';
import { EVENT_DATE, STATUS } from '../models/filter.model';
import { FilterDateComponent } from '../components/filter-date/filter-date.component';
import { DisplayView } from '../models/collection-display.model';
import { CollectionDisplayComponent } from '../components/collection-display/collection-display.component';
import {
  GALLERY_STORAGE_KEY,
  ISavedGallery,
} from '../../../gallery-upload/interface/upload-file';
import { NgTemplateOutlet } from '@angular/common';

@Component({
  selector: 'app-client-gallery',
  standalone: true,
  imports: [
    FormsModule,
    CollectionHeaderComponent,
    FilterDropdownComponent,
    FilterDateComponent,
    CollectionDisplayComponent,
    NgTemplateOutlet,
  ],
  templateUrl: './client-gallery.component.html',
  styleUrls: ['./client-gallery.component.css'],
})
export class ClientGalleryComponent {
  readonly currentStep = signal(1);
  readonly galleryName = signal('');
  readonly galleryDate = signal('');

  private readonly router = inject(Router);

  readonly STATUS = STATUS;
  readonly EVENT_DATE = EVENT_DATE;

  readonly displayView = signal<DisplayView>('list');
  readonly collections = signal<ISavedGallery[]>([]);

  readonly isCreatingNewCollection = signal(false);

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
}
