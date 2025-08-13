import { Component, EventEmitter, Output } from '@angular/core';
import { NgIf } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-upload-modal',
  templateUrl: './upload-modal.component.html',
  imports: [NgIf],
  styleUrls: ['./upload-modal.component.css'],
})
export class UploadModalComponent {
  @Output() fileSelected = new EventEmitter<File[]>();
  @Output() close = new EventEmitter<void>();
  isOpen = true;

  onFileSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.fileSelected.emit([...input.files]);
    }
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    if (event.dataTransfer?.files.length) {
      this.fileSelected.emit([...event.dataTransfer.files]);
    }
  }
}
