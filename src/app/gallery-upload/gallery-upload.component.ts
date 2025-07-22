import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FilePreviewPipe } from "../file-preview.pipe";
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-gallery-upload',
  imports: [FilePreviewPipe, CommonModule],
  templateUrl: './gallery-upload.component.html',
  styleUrl: './gallery-upload.component.css'
})
export class GalleryUploadComponent implements OnInit {

  @Input() galleryName: string = '';
  @Input() galleryDate: Date | undefined;
  //@Output() goBack = new EventEmitter<void>();

  files: File[] = [];
  coverImage: string | null = null;

  selectedCover: File | null = null;

  constructor(private router: Router) { }

  ngOnInit(): void {
    const state = history.state;
    if (state && state.galleryName && state.galleryDate) {
      this.galleryName = state.galleryName;
      //this.galleryDate = state.galleryDate;
      this.galleryDate = new Date(state.galleryDate);
    } else {
      // fallback или редирект, если пришли напрямую по ссылке
      console.warn('Нет данных из state');
      this.router.navigate(['/']); // например, на главную
    }
  }

  handleDrop(event: DragEvent) {
    event.preventDefault();
    if (event.dataTransfer?.files) {
      this.files = [...this.files, ...Array.from(event.dataTransfer.files)];
    }
  }

  handleFileSelect(event: any) {
    const selected = Array.from(event.target.files);
    this.files = [...this.files, ...(Array.from(event.dataTransfer.files) as File[])];
  }

  /*onBackClick() {
    this.goBack.emit();
  }*/

  goBackToPreviousPage() {
    this.router.navigate(['/client-gallery']); // или нужный путь
  }

  setAsCover(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      this.coverImage = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  setCover(file: File) {
    this.selectedCover = file;
    const reader = new FileReader();
    reader.onload = () => {
      this.coverImage = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

}
