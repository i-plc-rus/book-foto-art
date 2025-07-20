import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-gallery-switcher',
  imports: [CommonModule],
  templateUrl: './gallery-switcher.component.html',
  styleUrl: './gallery-switcher.component.css'
})
export class GallerySwitcherComponent {
 images = [
    { src: 'assets/personal.jpg', label: 'ВАШ СТИЛЬ' },
    { src: 'assets/gallery.jpg', label: 'ГАЛЕРЕИ' },
    { src: 'assets/space.jpg', label: 'ПОРТФОЛИО' }
  ];

  selectedIndex = 0;

  selectImage(index: number): void {
    this.selectedIndex = index;
  }
}
