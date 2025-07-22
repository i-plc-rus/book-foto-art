import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-client-gallery',
  imports: [CommonModule, FormsModule],
  templateUrl: './client-gallery.component.html',
  styleUrl: './client-gallery.component.css'
})
export class ClientGalleryComponent {
  currentStep = 1;

  galleryName = '';
  galleryDate = '';

  nextStep() {
    this.currentStep++;
  }
}
