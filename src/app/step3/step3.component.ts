import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-step3',
  imports: [FormsModule],
  templateUrl: './step3.component.html',
  styleUrl: './step3.component.css',
})
export class Step3Component implements OnInit {
  title = '';
  date = '';
  status = 'draft';
  uploadedFiles: { file: File; preview: string }[] = [];

  ngOnInit() {
    const meta = localStorage.getItem('galleryMeta');
    if (meta) {
      const data = JSON.parse(meta);
      this.title = data.title;
      this.date = data.date;
    }
  }

  onFileSelect(event: any) {
    for (const file of event.target.files) {
      this.previewFile(file);
    }
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    for (const file of event.dataTransfer?.files || []) {
      this.previewFile(file);
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  previewFile(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      this.uploadedFiles.push({ file, preview: reader.result as string });
    };
    reader.readAsDataURL(file);
  }

  onPublish() {
    console.log('Файлы для загрузки:', this.uploadedFiles);
    // TODO: отправить на backend
  }
}
