import {
  Component, computed,
  DestroyRef,
  effect, HostListener,
  inject, OnInit,
  signal,
} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SortMenuComponent} from '../shared/components/sort-menu/sort-menu.component';
import {GridSettingsComponent} from '../shared/components/grid-settings/grid-settings.component';
import {UploadModalComponent} from '../shared/modal/upload-modal/upload-modal.component';
import {SidebarService} from '../core/service/sidebar.service';
import {
  catchError,
  finalize,
  map,
  mergeMap,
  of,
  switchMap, tap,
} from 'rxjs';
import {UploadService} from '../core/service/upload.service';
import {ActivatedRoute, Router} from '@angular/router';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {CollectionService} from './service/collection.service';
import {SortType} from '../core/types/sort-type';
import {environment} from '../../environment/environment';
import {CollectionStateService} from './service/collection-state.service';

interface UploadFile {
  id: string;
  file: File;
  progress: number;
  previewUrl: string;
  loaded: boolean;
  error?: boolean;
}

interface MenuOption {
  id: string;
  name: string;
  iconUrl: string;
  subMenu?: SubMenuOption[];
}

interface SubMenuOption {
  id: string;
  name: string;
  iconUrl: string;
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
    UploadModalComponent,
  ],
  providers: [SidebarService, CollectionService, UploadService],
})
export class GalleryUploadComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly sidebarService = inject(SidebarService);
  private readonly uploadService = inject(UploadService);
  private readonly photoService = inject(CollectionService);
  private readonly route = inject(ActivatedRoute);
  private router = inject(Router);
  private readonly collectionStateService = inject(CollectionStateService);
  readonly collectionId = signal<string | null>(null);
  readonly files = signal<UploadFile[]>([]);
  readonly showStatus = signal(true);
  readonly sortType = signal<SortType>('uploaded_new');
  readonly gridSize = signal<'small' | 'large'>('small');
  readonly showFilename = signal(false);
  readonly showUploadModal = signal(false);
  readonly baseStaticUrl = environment.staticUrl;
  private readonly currentlyUploading = new Set<string>();
  readonly baseApiUrl = environment.apiUrl;
  readonly showEmptyState = computed(() => {
    return this.files().length === 0 &&
      this.currentlyUploading.size === 0 &&
      !this.isLoading();
  });
  readonly menuOpenId = signal<string | null>(null);
  menuHoverId = signal<string | null>(null);

  readonly isLoading = signal(true);

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
    },
  };
  readonly menuOptions = signal<MenuOption[]>([
    { id: 'open', name: 'Open', iconUrl: '/assets/icons/double-arrow.svg' },
    { id: 'share', name: 'Quick share link', iconUrl: '/assets/icons/link.svg' },
    { id: 'download', name: 'Download', iconUrl: '/assets/icons/download.svg' },
    {
      id: 'move',
      name: 'Move/Copy',
      iconUrl: '/assets/icons/move-copy.svg',
      subMenu: [
        { id: 'move_to', name: 'Move to', iconUrl: '/assets/icons/double-arrow.svg' },
        { id: 'copy_to', name: 'Copy to', iconUrl: '/assets/icons/double-arrow.svg' }
      ]
    },
    { id: 'copy', name: 'Copy filenames', iconUrl: '/assets/icons/copy.svg' },
    { id: 'cover', name: 'Set as cover', iconUrl: '/assets/icons/set-image.svg' },
    { id: 'rename', name: 'Rename', iconUrl: '/assets/icons/edit.svg' },
    { id: 'replace', name: 'Replace photo', iconUrl: '/assets/icons/replace.svg' },
    { id: 'watermark', name: 'Watermark', iconUrl: '/assets/icons/mark.svg' },
    { id: 'delete', name: 'Delete', iconUrl: '/assets/icons/delete.svg' },
  ]);

  constructor() {
    this.route.queryParams
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((params) => {
        const collectionId = params['collectionId'];
        this.collectionId.set(collectionId);

        if (collectionId) {
          this.collectionStateService.setCurrentCollectionId(collectionId);
        }
        else {
          this.collectionStateService.getCurrentCollectionId().subscribe(savedId => {
            if (savedId) {
              this.router.navigate([], {
                relativeTo: this.route,
                queryParams: { collectionId: savedId },
                queryParamsHandling: 'merge'
              });
            }
          });
        }
      });

    this.subscribeToRouteParams();
    this.initSidebar();
    this.initSortEffect();
    this.initPhotoLoadEffect();

  }

  onModalFileSelected(files: File[]) {
    this.processFiles(files);
    this.showUploadModal.set(false);
  }

  @HostListener('document:click', ['$event'])
  handleDocumentClick(event: MouseEvent) {
    if (!(event.target as HTMLElement).closest('.menu-container')) {
      this.menuOpenId.set(null);
    }
  }

  toggleMenu(fileId: string, event: MouseEvent) {
    event.stopPropagation();
    this.menuOpenId.set(this.menuOpenId() === fileId ? null : fileId);
  }

  handleOptionClick(optionId: string, file: UploadFile) {
    console.log(`Option clicked: ${optionId}`, file);
    this.menuOpenId.set(null);
    // Так мы можем реализовать действий для каждой опции
    // switch (optionId) {
    //   case 'open': this.openFile(file); break;
    //   case 'delete': this.deleteFile(file); break;
    // }
  }

  onMenuOptionMouseEnter(optionId: string) {
    this.menuHoverId.set(optionId);
  }

  onMenuOptionMouseLeave() {
    this.menuHoverId.set(null);
  }

  onSortChange(sort: string): void {
    if (this.isSortType(sort)) {
      this.sortType.set(sort);
    } else {
      console.warn('Invalid sort type:', sort);
    }
  }

  private isSortType(value: string): value is SortType {
    return ['uploaded_new', 'uploaded_old', 'name_az', 'name_za', 'random'].includes(value);
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

  private initPhotoLoadEffect() {
    effect(() => {
      const collectionId = this.collectionId();
      const sort = this.sortType();

      if (!collectionId) return;

      this.photoService.getPhotos(collectionId, { sort }).pipe(
        tap((collection: any) => {
          this.collectionStateService.setCollectionData({
            title: collection.name,
            date: new Date(collection.date),
            coverUrl: this.baseApiUrl + collection.cover_url
          });

          const file = {
            id: collection.id,
            file: new File([], collection.name || 'collection-cover', {
              lastModified: new Date(collection.created_at).getTime(),
            }),
            previewUrl: this.baseStaticUrl + collection.cover_thumbnail_url,
            progress: 100,
            loaded: true,
          };
          this.files.set([file]);
        }),
        catchError(err => {
          console.error('Ошибка загрузки фото:', err);
          return of(null);
        }),
        takeUntilDestroyed(this.destroyRef)
      ).subscribe();
    }, { allowSignalWrites: true });
  }

  private subscribeToRouteParams() {
    this.route.queryParams
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((params) => {
        const collectionId = params['collectionId'];
        this.collectionId.set(collectionId);

        if (this.collectionId()) {
          this.collectionStateService.setCurrentCollectionId(collectionId);
        }
      });
  }

  private initSidebar() {
    this.sidebarService.setTitle('Медиа файлы');
    this.sidebarService.setDate(new Date());
  }

  private initSortEffect() {
    effect(() => {
      this.applySort(this.sortType());
    }, {allowSignalWrites: true});
  }

  private async processFiles(files: File[]) {
    if (!files.length) return;

    this.showStatus.set(true);

    const existingHashes = await this.getExistingHashes();
    const newFiles: UploadFile[] = [];

    for (const file of files) {
      const hash = await this.getFileHash(file);
      if (!existingHashes.has(hash)) {
        const uploadFile = this.createUploadFile(file);
        newFiles.push(uploadFile);
        existingHashes.add(hash);
      }
    }

    if (!newFiles.length) return;

    newFiles.forEach((f) => this.currentlyUploading.add(f.id));
    this.files.update((prev) => [...prev, ...newFiles]);
    this.updateUploadStats();
    this.uploadFiles(newFiles);
  }

  private uploadFiles(filesToUpload: UploadFile[]) {
    const collectionId = this.collectionId();
    if (!collectionId) return;

    this.uploadStats.startTime.set(Date.now());

    // Константа для ограничения количества одновременных запросов
    const MAX_CONCURRENT_UPLOADS = 4;
    let currentUploads = 0;
    let currentIndex = 0;

    const uploadNext = () => {
      while (currentIndex < filesToUpload.length && currentUploads < MAX_CONCURRENT_UPLOADS) {
        const file = filesToUpload[currentIndex];
        currentIndex++;
        currentUploads++;

        this.uploadService.uploadFile(file.file, collectionId).pipe(
          tap(({progress}) => {
            this.files.update(prev =>
              prev.map(f =>
                f.id === file.id
                  ? {...f, progress, loaded: progress === 100}
                  : f
              )
            );
            this.updateUploadStats();
          }),
          catchError(error => {
            console.error('Upload error:', error);
            // Помечаем файл как ошибочный
            this.files.update(prev =>
              prev.map(f =>
                f.id === file.id
                  ? {...f, error: true, loaded: true}
                  : f
              )
            );
            return of({ progress: -1 }); // Возвращаем фейковый прогресс для продолжения потока
          }),
          finalize(() => {
            currentUploads--;
            uploadNext(); // Запустить следующую загрузку
            this.updateUploadStats();

            if (currentUploads === 0 && currentIndex >= filesToUpload.length) {
              this.currentlyUploading.clear();
            }
          })
        ).subscribe();
      }
    };

    uploadNext(); // Начать процесс загрузки
  }

  private updateUploadStats() {
    const uploading = this.files().filter((f) =>
      this.currentlyUploading.has(f.id)
    );
    const uploaded = uploading.filter((f) => f.loaded);

    const totalSize = uploading.reduce((acc, f) => acc + f.file.size, 0);
    const uploadedSize = uploading.reduce(
      (acc, f) => acc + (f.file.size * f.progress) / 100,
      0
    );

    this.uploadStats.totalFiles.set(uploading.length);
    this.uploadStats.uploadedFiles.set(uploaded.length);
    this.uploadStats.totalSize.set(totalSize);
    this.uploadStats.uploadedSize.set(uploadedSize);

    const elapsed = (Date.now() - this.uploadStats.startTime()) / 1000;
    this.uploadStats.uploadSpeed.set(elapsed > 0 ? uploadedSize / elapsed : 0);
    this.uploadStats.allFilesUploaded.set(uploading.every((f) => f.loaded));
  }

  private createUploadFile(file: File): UploadFile {
    return {
      id: Math.random().toString(36).substring(2),
      file,
      progress: 0,
      previewUrl: URL.createObjectURL(file),
      loaded: false,
    };
  }

  private async getExistingHashes(): Promise<Set<string>> {
    const hashes = new Set<string>();
    for (const file of this.files()) {
      hashes.add(await this.getFileHash(file.file));
    }
    return hashes;
  }

  private async getFileHash(file: File): Promise<string> {
    const buffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  }

  private applySort(sortType: string) {
    this.files.update((prev) => {
      const sorted = [...prev];
      switch (sortType) {
        case 'uploaded_new':
          return sorted.sort(
            (a, b) => b.file.lastModified - a.file.lastModified
          );
        case 'uploaded_old':
          return sorted.sort(
            (a, b) => a.file.lastModified - b.file.lastModified
          );
        case 'name_az':
          return sorted.sort((a, b) => a.file.name.localeCompare(b.file.name));
        case 'name_za':
          return sorted.sort((a, b) => b.file.name.localeCompare(a.file.name));
        case 'random':
          return sorted.sort(() => Math.random() - 0.5);
        default:
          return sorted;
      }
    });
  }
}
