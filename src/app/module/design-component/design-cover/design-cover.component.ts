import { CommonModule } from '@angular/common';
import type { ElementRef, OnInit } from '@angular/core';
import { Component, computed, DestroyRef, inject, signal, ViewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs';

import { CollectionApiService } from '../../../api/collection-api.service';
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

  ngOnInit() {
    if (this.templates().length > 0) {
      this.selectedTemplate.set(this.templates()[0]);
    }
  }

  openChangeCoverModal(): void {
    this.showChangeCoverModal.set(true);
  }

  openSelectCoverPhotoModal(): void {
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

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.previewImageUrl = URL.createObjectURL(file);
      this.selectedPhoto = file;

      if (!this.showSelectCoverPhotoModal()) {
        this.showSelectCoverPhotoModal.set(true);
      }
    }
  }

  handlePhotoSelected(photo: any): void {
    this.selectedPhoto = photo;
    this.previewImageUrl = photo.url;
  }

  confirmCoverSelection(): void {
    if (this.previewImageUrl) {
      this.selectedTemplate.set({
        id: 'custom',
        name: 'Custom Cover',
        image: this.previewImageUrl,
      });

      this.collectionStateService.notifyCoverUpdated(this.collectionId(), this.selectedPhoto.url);

      this.collectionApiService
        .updateCollectionCover(this.collectionId(), this.selectedPhoto.id)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe();

      this.closeChangeCoverModal();
      this.closeSelectCoverPhotoModal();
    }
  }

  resetCoverSelection(): void {
    this.selectedPhoto = null;
    this.previewImageUrl = null;
    if (this.fileInput?.nativeElement) {
      this.fileInput.nativeElement.value = '';
    }
  }

  loadCollectionPhotos() {
    this.route.queryParams.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params: any) => {
      const collectionId = params['collectionId'];
      this.collectionId.set(collectionId);
      this.fetchPhotos(collectionId);
    });
  }

  private fetchPhotos(collectionId: string) {
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
      url: photo.original_url,
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

  selectTemplate(template: CoverTemplate) {
    this.selectedTemplate.set(template);
  }

  setViewMode(mode: 'desktop' | 'icon-m') {
    this.viewMode.set(mode);
  }

  loadMore() {
    this.itemsToShow.set(this.itemsToShow() + 6);
  }

  hasMore(): boolean {
    return this.itemsToShow() < this.regularTemplates().length;
  }

  openFocalPointModal() {
    this.showFocalModal.set(true);
  }

  handleFocalPointSave(position: { x: number; y: number }) {
    this.mainLayout.updateFocalPoint(position);
    this.showFocalModal.set(false);
  }
}
