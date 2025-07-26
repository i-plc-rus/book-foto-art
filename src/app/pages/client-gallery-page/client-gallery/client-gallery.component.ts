import { Component, signal, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CollectionHeaderComponent } from '../components/collection-header/collection-header.component';
import { FilterDropdownComponent } from '../components/filter-dropdown/filter-dropdown.component';
import { EVENT_DATE, STATUS } from '../models/filter.model';

@Component({
  selector: 'app-client-gallery',
  standalone: true,
  imports: [FormsModule, CollectionHeaderComponent, FilterDropdownComponent],
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

  nextStep() {
    this.currentStep.update((step) => {
      const next = step + 1;
      if (next >= 3) {
        this.router.navigate(['/upload'], {
          state: {
            galleryName: this.galleryName(),
            galleryDate: this.galleryDate(),
          },
        });
        return 3;
      }
      return next;
    });
  }

  goBack() {
    this.currentStep.update((step) => Math.max(1, step - 1));
  }
}
