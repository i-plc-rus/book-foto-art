import { CommonModule } from '@angular/common';
import type { ElementRef, OnInit } from '@angular/core';
import { Component, computed, DestroyRef, inject, signal, ViewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { finalize, last, switchMap } from 'rxjs';

import { CollectionApiService } from '../../../api/collection-api.service';
import { UploadService } from '../../../core/service/upload.service';
import { CollectionService } from '../../../gallery-upload/service/collection.service';
import { CollectionStateService } from '../../../gallery-upload/service/collection-state.service';
import { DevicePreviewComponent } from '../../../shared/components/device-preview/device-preview.component';
import type { IActionBarItem } from '../../../shared/components/editor-action-bar/action-bar-item';
import { ActionBarComponent } from '../../../shared/components/editor-action-bar/editor-action-bar.component';
import { ChangeCoverComponent } from '../../../shared/modal/change-cover/change-cover.component';
import { FocalPointModalComponent } from '../../../shared/modal/focal-point-modal/focal-point-modal.component';
import { SelectCoverPhotoComponent } from '../../../shared/modal/select-cover-photo/select-cover-photo.component';
import { MainLayoutComponent } from '../../main-layout/main-layout.component';
import type { CoverTemplate } from './cover-template';
import { ACTION_BAR_ITEMS, COVER_TEMPLATES } from './design-cover.constants';

@Component({
  standalone: true,
  selector: 'app-design-cover',
  templateUrl: './design-cover.component.html',
  styleUrl: './design-cover.component.css',
  imports: [
    CommonModule,
    ActionBarComponent,
    DevicePreviewComponent,
    FocalPointModalComponent,
    ChangeCoverComponent,
    SelectCoverPhotoComponent,
  ],
})
export class DesignCoverComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef;

  private readonly collectionApiService: CollectionApiService = inject(CollectionApiService);
  private readonly collectionStateService = inject(CollectionStateService);
  private readonly router = inject(Router);
  private readonly uploadService = inject(UploadService);
  private readonly messageService = inject(MessageService);

  isUploadingCover = signal(false);
  uploadProgress = signal(0);

  templates = signal<CoverTemplate[]>(COVER_TEMPLATES);
  actionBarItems = ACTION_BAR_ITEMS;

  isPreviewDisabled = false;
  isPublishDisabled = true;

  collectionPhotos = signal<any[]>([]);
  isLoading = signal(false);
  previewImageUrl: string | null = null;
  selectedPhoto: any = null;
  collectionId = signal('');
  showChangeCoverModal = signal(false);
  showSelectCoverPhotoModal = signal(false);

  selectedTemplate = signal<CoverTemplate | null>(null);
  viewMode = signal<'desktop' | 'icon-m'>('desktop');
  itemsToShow = signal(6);
  showFocalModal = signal(false);

  private mainLayout = inject(MainLayoutComponent);
  private readonly collectionService = inject(CollectionService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly route = inject(ActivatedRoute);

  containerWidth = computed(() => (this.viewMode() === 'icon-m' ? 'w-[280px]' : 'w-[420px]'));

  regularTemplates = computed(() => this.templates().filter((t) => t.id !== 'none'));

  visibleTemplates = computed(() => this.regularTemplates().slice(0, this.itemsToShow()));

  noneTemplate = computed(() => this.templates().find((t) => t.id === 'none')!);

  ngOnInit(): void {
    this.route.queryParams.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
      const id = params['collectionId'];
      if (id) {
        this.collectionId.set(id);
        // если хочешь — сохраним в state-сервис
        this.collectionStateService.setCurrentCollectionId(id);
      }
    });
  }

  openChangeCoverModal(): void {
    this.showSelectCoverPhotoModal.set(false);
    this.showChangeCoverModal.set(true);
  }

  openSelectCoverPhotoModal(): void {
    this.showChangeCoverModal.set(false);
    this.showSelectCoverPhotoModal.set(true);
    this.loadCollectionPhotos();
  }

  closeAllModals(): void {
    this.closeChangeCoverModal();
    this.closeSelectCoverPhotoModal();
  }

  closeChangeCoverModal(): void {
    this.showChangeCoverModal.set(false);
  }

  closeSelectCoverPhotoModal(): void {
    this.showSelectCoverPhotoModal.set(false);
    this.resetCoverSelection();
  }

  triggerFileInput(): void {
    this.fileInput.nativeElement.click();
  }

  async onFileSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    // мгновенный локальный превью
    this.previewImageUrl = URL.createObjectURL(file);
    this.selectedTemplate.set({ id: 'custom', name: 'Custom Cover', image: this.previewImageUrl });

    await this.uploadAndSetCover(file);

    input.value = ''; // чтобы можно было выбрать тот же файл повторно
  }

  private async uploadAndSetCover(file: File): Promise<void> {
    const collectionId = this.collectionId();
    if (!collectionId) return;

    this.uploadService
      .uploadFile(file, collectionId) // прогресс
      .pipe(last()) // ждём финальный HTTP Response
      .pipe(
        switchMap((event) => {
          const photoId = (event as any)?.body?.ids?.[0] ?? (event as any)?.body?.id;
          if (!photoId) throw new Error('Не удалось получить id загруженного фото');
          return this.collectionApiService.updateCollectionCover(collectionId, photoId);
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: () => {
          // закрыть модалки
          this.closeSelectCoverPhotoModal();
          this.closeChangeCoverModal();

          // перейти на список файлов
          this.goBackToUpload();
        },
        error: () => {
          // тост об ошибке — по желанию
        },
      });
  }

  private addCacheBust(u: string): string {
    if (!u) return u;
    const sep = u.includes('?') ? '&' : '?';
    return `${u}${sep}v=${Date.now()}`;
  }

  handlePhotoSelected(photo: any): void {
    this.selectedPhoto = photo;
    this.previewImageUrl = photo.url;
  }

  confirmCoverSelection(): void {
    if (!this.selectedPhoto?.id) return;

    const id = this.collectionId();
    this.collectionApiService
      .updateCollectionCover(id, this.selectedPhoto.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          // уведомляем MainLayout
          this.collectionStateService.notifyCoverUpdated(id, this.selectedPhoto.url);

          // закрываем модалки и уходим на upload
          this.closeSelectCoverPhotoModal();
          this.closeChangeCoverModal();
          this.router.navigate(['/upload'], { queryParams: { collectionId: id } });
        },
        error: () => {},
      });
  }

  resetCoverSelection(): void {
    this.selectedPhoto = null;
    this.previewImageUrl = null;
    if (this.fileInput?.nativeElement) {
      this.fileInput.nativeElement.value = '';
    }
  }

  loadCollectionPhotos(): void {
    this.route.queryParams.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params: any) => {
      const collectionId = params['collectionId'];
      this.collectionId.set(collectionId);
      this.fetchPhotos(collectionId);
    });
  }

  private fetchPhotos(collectionId: string): void {
    this.isLoading.set(true);

    this.collectionService
      .getPhotos(collectionId, {})
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.isLoading.set(false)),
      )
      .subscribe({
        next: (response: any) => {
          this.collectionPhotos.set(response.files.map((photo: any) => this.mapPhotoToView(photo)));
        },
        error: (err) => {
          console.error('Failed to load photos:', err);
          this.collectionPhotos.set([]);
        },
      });
  }

  private mapPhotoToView(photo: any): any {
    return {
      id: photo.id,
      name: photo.file_name,
      url: photo.thumbnail_url,
      file: {
        name: photo.file_name,
        lastModified: new Date(photo.uploaded_at).getTime(),
        size: photo.file_size,
        type: `image/${photo.file_ext.slice(1)}`,
      },
    };
  }

  handleMenuItem(item: IActionBarItem): void {
    switch (item.id) {
      case 'get-link':
        this.getDirectLink();
        break;
      case 'delete':
        this.deleteCollection();
        break;
    }
  }

  handleButtonClick(type: 'preview' | 'publish'): void {
    if (type === 'preview') {
      this.preview();
    } else {
      this.publish();
    }
  }

  preview(): void {
    console.log('Preview action');
  }

  publish(): void {
    console.log('Publish action');
  }

  getDirectLink(): void {
    console.log('Getting direct link');
  }

  deleteCollection(): void {
    console.log('Deleting collection');
  }

  isSelected(template: CoverTemplate): boolean {
    return this.selectedTemplate()?.id === template.id;
  }

  selectTemplate(template: CoverTemplate): void {
    this.selectedTemplate.set(template);
  }

  setViewMode(mode: 'desktop' | 'icon-m'): void {
    this.viewMode.set(mode);
  }

  loadMore(): void {
    this.itemsToShow.set(this.itemsToShow() + 6);
  }

  hasMore(): boolean {
    return this.itemsToShow() < this.regularTemplates().length;
  }

  openFocalPointModal(): void {
    this.showFocalModal.set(true);
  }

  handleFocalPointSave(position: { x: number; y: number }): void {
    this.mainLayout.updateFocalPoint(position);
    this.showFocalModal.set(false);
  }

  private goBackToUpload(): void {
    const id = this.collectionId();
    if (!id) return;
    this.router.navigate(['/upload'], { queryParams: { collectionId: id } });
  }
}
