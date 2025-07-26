import { Component, signal, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-client-gallery',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './client-gallery.component.html',
  styleUrls: ['./client-gallery.component.css'],
})
export class ClientGalleryComponent {
  currentStep = signal(1);
  galleryName = signal('');
  galleryDate = signal('');

  private router = inject(Router);

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
