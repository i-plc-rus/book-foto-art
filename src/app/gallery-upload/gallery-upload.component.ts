import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FilePreviewPipe } from "../file-preview.pipe";
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';


interface UploadFile {
  file: File;
  previewUrl: string;
  progress: number; // от 0 до 100
  uploaded: boolean;
}

@Component({
  selector: 'app-gallery-upload',
  //imports: [FilePreviewPipe, CommonModule],
  imports: [CommonModule],
  templateUrl: './gallery-upload.component.html',
  styleUrl: './gallery-upload.component.css'
})
export class GalleryUploadComponent implements OnInit {
  
  

  @Input() galleryName: string = '';
  @Input() galleryDate: Date | undefined;
  //@Output() goBack = new EventEmitter<void>();

  


files: UploadFile[] = [];
coverImage: string | null = null;

selectedCover: File | null = null;

constructor(private router: Router) { }

ngOnInit(): void {
  const state = history.state;
  if(state && state.galleryName && state.galleryDate) {
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
    const newFiles: UploadFile[] = Array.from(event.dataTransfer.files).map(file => ({
      file,
      previewUrl: URL.createObjectURL(file),
      progress: 0,
      uploaded: false
    }));

    this.files = [...this.files, ...newFiles];
  }
}

handleFileSelect(event: Event) {
  const input = event.target as HTMLInputElement;
  if (input.files) {
    const newFiles: UploadFile[] = Array.from(input.files).map(file => ({
      file,
      previewUrl: URL.createObjectURL(file),
      progress: 0,
      uploaded: false
    }));

    this.files = [...this.files, ...newFiles];
  }
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

uploadFile(uploadFile: UploadFile) {
  const formData = new FormData();
  formData.append('file', uploadFile.file);

  const xhr = new XMLHttpRequest();
  xhr.open('POST', '/api/upload', true);

  xhr.upload.onprogress = (event) => {
    if (event.lengthComputable) {
      const percent = Math.round((event.loaded / event.total) * 100);
      uploadFile.progress = percent;
    }
  };

  xhr.onload = () => {
    if (xhr.status === 200) {
      uploadFile.uploaded = true;
    } else {
      console.error('Ошибка загрузки', xhr.responseText);
    }
  };

  xhr.send(formData);
}

}
