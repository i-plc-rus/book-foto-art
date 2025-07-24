import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Location } from '@angular/common';
import { UploadStatsService } from '../core/service/upload-stats.service';
import { IUploadFile } from './interface/upload-file';

@Component({
  standalone: true,
  selector: 'app-gallery-upload',
  templateUrl: './gallery-upload.component.html',
  styleUrl: './gallery-upload.component.css',
  imports: [CommonModule]
})
export class GalleryUploadComponent  {
  galleryName = signal('Моя галерея');
  galleryDate = signal(new Date());
  files = signal<IUploadFile[]>([]);
  showStatus = signal(true);

  private location = inject(Location);
  private uploadStats = inject(UploadStatsService);

  get totalFiles() { return this.uploadStats.totalFiles; }
  get uploadedFiles() { return this.uploadStats.uploadedFiles; }
  get totalSize() { return this.uploadStats.totalSize; }
  get uploadedSize() { return this.uploadStats.uploadedSize; }
  get uploadSpeed() { return this.uploadStats.uploadSpeed; }
  get allFilesUploaded() { return this.uploadStats.allFilesUploaded; }

  formatBytes = this.uploadStats.formatBytes.bind(this.uploadStats);

  closeStatus() {
    this.showStatus.set(false);
  }

  handleFileSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.processFiles([...input.files]);
    }
  }

  handleDrop(event: DragEvent) {
    event.preventDefault();
    if (!event.dataTransfer?.files.length) return;
    this.processFiles([...event.dataTransfer.files]);
  }

  simulateUpload(fileIds?: string[]) {
    const idsToUpload = fileIds ?? this.files().filter(f => !f.loaded).map(f => f.id);
    let index = 0;

    const uploadNext = () => {
      if (index >= idsToUpload.length) return;

      const currentFileId = idsToUpload[index];
      let progress = 0;

      const interval = setInterval(() => {
        progress += 5;

        this.files.update(prev =>
          prev.map(f =>
            f.id === currentFileId
              ? { ...f, progress, loaded: progress >= 100 }
              : f
          )
        );

        this.uploadStats.files.set(this.files());

        if (progress >= 100) {
          clearInterval(interval);
          index++;
          uploadNext();
        }
      }, 150);
    };

    uploadNext();
  }

  goBackToPreviousPage() {
    this.location.back();
  }

  private async getFileHash(file: File): Promise<string> {
    const buffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  private async processFiles(files: File[]) {
    this.showStatus.set(true);
    const existing = this.files();
    const hashes = new Map<string, File>();

    for (const file of files) {
      const hash = await this.getFileHash(file);
      hashes.set(hash, file);
    }

    const existingHashes = new Set<string>();
    for (const f of existing) {
      const hash = await this.getFileHash(f.file);
      existingHashes.add(hash);
    }

    const filtered: File[] = [];
    for (const [hash, file] of hashes.entries()) {
      if (!existingHashes.has(hash)) {
        filtered.push(file);
      }
    }

    if (filtered.length === 0) return;

    const newFiles: IUploadFile[] = filtered.map(file => ({
      file,
      progress: 0,
      previewUrl: URL.createObjectURL(file),
      id: Math.random().toString(36).substring(2),
      loaded: false
    }));

    this.files.update(prev => [...prev, ...newFiles]);

    this.uploadStats.files.set(this.files());
    this.uploadStats.startTime.set(Date.now());

    this.simulateUpload(newFiles.map(f => f.id));
  }
}
