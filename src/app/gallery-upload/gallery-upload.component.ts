import { Component, DestroyRef, effect, inject, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SortMenuComponent } from '../shared/components/sort-menu/sort-menu.component';
import { GridSettingsComponent } from '../shared/components/grid-settings/grid-settings.component';
import { UploadModalComponent } from '../shared/modal/upload-modal/upload-modal.component';
import { SidebarService } from '../core/service/sidebar.service';
import {catchError, finalize, map, mergeMap, of} from 'rxjs';
import { UploadService } from '../core/service/upload.service';
import { ActivatedRoute } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { GALLERY_STORAGE_KEY, ISavedGallery } from './interface/upload-file';

interface UploadFile {
  id: string;
  file: File;
  progress: number;
  previewUrl: string;
  loaded: boolean;
}

@Component({
  standalone: true,
  selector: 'app-gallery-upload',
  templateUrl: './gallery-upload.component.html',
  styleUrls: ['./gallery-upload.component.css'],
  imports: [
    CommonModule,
    SortMenuComponent,
    GridSettingsComponent,
    UploadModalComponent
  ],
  providers: [SidebarService]
})
export class GalleryUploadComponent implements OnDestroy {
  collectionId: string | null = null;

  private sidebarService = inject(SidebarService);
  readonly files = signal<UploadFile[]>([]);
  readonly showStatus = signal(true);
  readonly sortType = signal('uploaded_new');
  readonly gridSize = signal<'small' | 'large'>('small');
  readonly showFilename = signal(false);
  readonly showUploadModal = signal(false);
  private uploadService = inject(UploadService);
  private route = inject(ActivatedRoute);

  // TODO: удалить, когда подключат бэкенд
  readonly galleryName = signal('Моя галерея');
  // TODO: удалить, когда подключат бэкенд
  readonly galleryDate = signal(new Date());

  readonly uploadStats = {
    totalFiles: signal(0),
    uploadedFiles: signal(0),
    totalSize: signal(0),
    uploadedSize: signal(0),
    uploadSpeed: signal(0),
    allFilesUploaded: signal(false),
    startTime: signal(0),

    formatBytes(bytes: number, decimals = 2): string {
      if (bytes === 0) return '0 Bytes';
      const k = 1024;
      const dm = decimals < 0 ? 0 : decimals;
      const sizes = ['Bytes', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }
  };
  private readonly destroyRef = inject(DestroyRef);
  private currentlyUploading = new Set<string>();
  private uploadTimers: { [key: string]: any } = {};

  constructor() {
    this.route.queryParams.subscribe(params => {
      this.collectionId = params['collectionId'] || null;

      if (!this.collectionId) {
        this.collectionId = localStorage.getItem('collectionId');
      }

      if (!this.collectionId) {
        console.error('collectionId не найден ни в queryParams, ни в localStorage');
      }
    });

    this.sidebarService.setTitle('Медиа файлы');
    this.sidebarService.setDate(new Date());

    effect(() => {
      this.applySort(this.sortType());
    }, { allowSignalWrites: true });
  }

  onModalFileSelected(files: File[]) {
    this.processFiles(files);
    this.showUploadModal.set(false);
  }

  onSortChange(sort: string) {
    this.sortType.set(sort);
  }

  onGridSizeChange(size: 'small' | 'large') {
    this.gridSize.set(size);
  }

  onShowFilenameChange(value: boolean) {
    this.showFilename.set(value);
  }

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
    if (event.dataTransfer?.files.length) {
      this.processFiles([...event.dataTransfer.files]);
    }
  }

  private async processFiles(files: File[]) {
    if (files.length === 0) return;

    this.showStatus.set(true);
    const newFiles: UploadFile[] = [];

    const existingHashes = await this.getExistingHashes();

    for (const file of files) {
      const hash = await this.getFileHash(file);
      if (!existingHashes.has(hash)) {
        newFiles.push(this.createUploadFile(file));
        existingHashes.add(hash);
      }
    }

    if (newFiles.length === 0) return;

    this.currentlyUploading = new Set(newFiles.map(f => f.id));

    this.files.update(prev => [...prev, ...newFiles]);
    this.updateUploadStats();
    this.uploadFilesRx(newFiles);
// TODO: удалить, когда подключат бэкенд
    this.saveGalleryToLocalStorage();
  }

  private uploadFilesRx(filesToUpload: UploadFile[]) {
    if (!this.collectionId) {
      return;
    }

    this.uploadStats.startTime.set(Date.now());

    const uploads$ = of(...filesToUpload).pipe(
      mergeMap((file) => {
        return this.uploadService.uploadFile(file.file, this.collectionId!).pipe(
          map(({ progress }) => {
            this.files.update(prev =>
              prev.map(f =>
                f.id === file.id
                  ? { ...f, progress, loaded: progress === 100 }
                  : f
              )
            );
            this.updateUploadStats();
            return progress;
          })
        );
      }),
      finalize(() => {
        this.updateUploadStats();
        this.currentlyUploading.clear();
      }),
      takeUntilDestroyed(this.destroyRef)
    );
    uploads$.subscribe();
  }

  private updateUploadStats() {
    const files = this.files().filter(f => this.currentlyUploading.has(f.id));

    this.uploadStats.totalFiles.set(files.length);
    this.uploadStats.uploadedFiles.set(files.filter(f => f.loaded).length);

    const totalSize = files.reduce((sum, f) => sum + f.file.size, 0);
    const uploadedSize = files.reduce((sum, f) => sum + (f.file.size * f.progress / 100), 0);

    this.uploadStats.totalSize.set(totalSize);
    this.uploadStats.uploadedSize.set(uploadedSize);

    const elapsed = (Date.now() - this.uploadStats.startTime()) / 1000;
    this.uploadStats.uploadSpeed.set(elapsed > 0 ? uploadedSize / elapsed : 0);

    this.uploadStats.allFilesUploaded.set(files.every(f => f.loaded));
  }

  private createUploadFile(file: File): UploadFile {
    return {
      file,
      progress: 0,
      previewUrl: URL.createObjectURL(file),
      id: Math.random().toString(36).substring(2),
      loaded: false
    };
  }

  private async getExistingHashes(): Promise<Set<string>> {
    const hashes = new Set<string>();
    const files = this.files();

    for (const file of files) {
      hashes.add(await this.getFileHash(file.file));
    }

    return hashes;
  }

  private async getFileHash(file: File): Promise<string> {
    const buffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }


  private applySort(sortType: string) {
    this.files.update(prev => {
      const sorted = [...prev];

      switch (sortType) {
        case 'uploaded_new':
          return sorted.sort((a, b) => b.file.lastModified - a.file.lastModified);
        case 'uploaded_old':
          return sorted.sort((a, b) => a.file.lastModified - b.file.lastModified);
        case 'az':
          return sorted.sort((a, b) => a.file.name.localeCompare(b.file.name));
        case 'za':
          return sorted.sort((a, b) => b.file.name.localeCompare(a.file.name));
        case 'random':
          return sorted.sort(() => Math.random() - 0.5);
        default:
          return sorted;
      }
    });
  }

  ngOnDestroy() {
    for (const timer of Object.values(this.uploadTimers)) {
      clearInterval(timer);
    }

    this.files().forEach(file => {
      URL.revokeObjectURL(file.previewUrl);
    });
  }

  // TODO: удалить, когда подключат бэкенд
  private async saveGalleryToLocalStorage() {
    const name = this.galleryName();
    const createDate = this.galleryDate().toISOString();

    const base64Images = await Promise.all(
      this.files().map((f) => this.fileToBase64(f.file))
    );

    const newGallery: ISavedGallery = {
      name,
      createDate,
      images: base64Images.length ? base64Images : ['assets/cover.png'],
    };

    const existingRaw = localStorage.getItem(GALLERY_STORAGE_KEY);
    const existing: ISavedGallery[] = existingRaw
      ? JSON.parse(existingRaw)
      : [];

    const filtered = existing.filter((g) => g.name !== name);

    filtered.push(newGallery);

    localStorage.setItem(GALLERY_STORAGE_KEY, JSON.stringify(filtered));
  }

  // TODO: удалить, когда подключат бэкенд
  async fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }
  
}
