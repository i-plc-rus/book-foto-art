import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CommonModule} from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-select-cover-photo',
  templateUrl: './select-cover-photo.component.html',
  styleUrl: './select-cover-photo.component.css',
  imports: [
    CommonModule
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
  gridSize: 'small' | 'large' = 'small';


  selectPhotoId(id: string) {
    this.selectedPhotoId = id;

    const selectedPhoto = this.collectionPhotos.find(photo => photo.id === id);
    if (selectedPhoto) {
      this.photoSelected.emit(selectedPhoto);
    }
  }

}
