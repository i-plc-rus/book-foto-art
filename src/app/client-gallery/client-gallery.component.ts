import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CollectionService } from '../core/service/collection.service.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  standalone: true,
  selector: 'app-client-gallery',
  templateUrl: './client-gallery.component.html',
  styleUrls: ['./client-gallery.component.css'],
  imports: [CommonModule, FormsModule],
  providers: [CollectionService]
})
export class ClientGalleryComponent implements OnInit {
  currentStep = 1;
  galleryName = '';
  galleryDate = '';

  isLoading = false;
  errorMessage = '';
  collectionId: string | undefined;
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);
  private readonly collectionService = inject(CollectionService);

  ngOnInit() {
  }

  nextStep() {
    if (this.currentStep === 2) {
      if (!this.galleryName.trim() || !this.galleryDate) {
        this.errorMessage = 'Пожалуйста, заполните имя и дату коллекции';
        return;
      }

      this.errorMessage = '';
      this.isLoading = true;

      this.collectionService.createCollection({
        name: this.galleryName,
        date: this.galleryDate
      }).pipe(
        takeUntilDestroyed(this.destroyRef)
      ).subscribe(res => {
        this.isLoading = false;
        if (res) {
          this.collectionId = res.id;
          localStorage.setItem('collectionId', this.collectionId);
          this.router.navigate(['/upload'], {
            queryParams: { collectionId: this.collectionId }
          });
        }
      });

    } else {
      this.currentStep++;
    }
  }
}
