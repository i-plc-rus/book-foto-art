import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-client-gallery',
  imports: [CommonModule, FormsModule],
  templateUrl: './client-gallery.component.html',
  standalone: true,
  styleUrl: './client-gallery.component.css'
})
export class ClientGalleryComponent implements OnInit {
  currentStep = 1;

  galleryName = '';
  galleryDate = '';

  constructor(private router: Router) { }

  ngOnInit() {
  }

  nextStep() {
    this.currentStep++;
    if (this.currentStep >= 3) {
      this.currentStep = 3;
      this.router.navigate(['/upload'], {
        state: {
          galleryName: this.galleryName,
          galleryDate: this.galleryDate
        }
      });
    }
  }

  goBack() {
    this.currentStep--;
    if (this.currentStep<=0) {
      this.currentStep == 0;
    }
  }

}
