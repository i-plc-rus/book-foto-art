import { Injectable, computed, signal } from '@angular/core';
import {IUploadFile} from '../../gallery-upload/interface/upload-file';

@Injectable({
  providedIn: 'root'
})
export class UploadStatsService {
  files = signal<IUploadFile[]>([]);
  startTime = signal<number | null>(null);

  totalFiles = computed(() => this.files().length);
  uploadedFiles = computed(() => this.files().filter(f => f.loaded).length);
  totalSize = computed(() =>
    this.files().reduce((sum, file) => sum + file.file.size, 0)
  );
  uploadedSize = computed(() =>
    this.files().reduce((sum, file) => sum + (file.file.size * file.progress / 100), 0)
  );
  uploadSpeed = computed(() => {
    if (!this.startTime()) return 0;
    const secondsPassed = (Date.now() - this.startTime()!) / 1000;
    return secondsPassed > 0 ? this.uploadedSize() / secondsPassed : 0;
  });
  allFilesUploaded = computed(() =>
    this.files().every(file => file.loaded)
  );

  formatBytes(bytes: number, decimals = 2): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }
}
