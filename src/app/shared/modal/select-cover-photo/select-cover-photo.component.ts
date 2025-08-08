import {Component, EventEmitter, Input, Output} from '@angular/core';
import {NgForOf, NgIf} from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-select-cover-photo',
  templateUrl: './select-cover-photo.component.html',
  styleUrl: './select-cover-photo.component.css',
  imports: [
    NgForOf,
    NgIf
  ]
})
export class SelectCoverPhotoComponent {
  @Input() collectionPhotos: any[] = [];
  @Input() isLoading = false;
  @Input() previewImageUrl: string | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() uploadPhoto = new EventEmitter<void>();
  @Output() selectPhoto = new EventEmitter<void>();
  @Output() photoSelected = new EventEmitter<any>();

  selectedPhotoId: string | null = null;
  gridSize: 'small' | 'large' = 'small'; // По умолчанию маленькая сетка


  selectPhotoId(id: string) {
    this.selectedPhotoId = this.selectedPhotoId === id ? null : id;
    this.photoSelected.emit(id);
  }

  selectPhotoFromCollection(photo: any) {
    this.selectedPhotoId = photo.id;
    this.photoSelected.emit(photo);
  }
}
