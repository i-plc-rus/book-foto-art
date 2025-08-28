import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Button } from 'primeng/button';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { Subject } from 'rxjs';

import { ModalService } from '../../../../shared/service/modal/modal.service';
import type { ImagePreviewData } from '../../model/image-preview.model';

@Component({
  selector: 'app-image-preview-modal',
  standalone: true,
  imports: [CommonModule, Button, ConfirmDialog],
  templateUrl: './image-preview-modal.component.html',
  styleUrls: ['./image-preview-modal.component.scss'],
  providers: [ConfirmationService, MessageService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImagePreviewModalComponent {
  private readonly modalService = inject(ModalService);
  private readonly dialogRef = inject(DialogRef);
  private readonly data = inject<ImagePreviewData>(DIALOG_DATA);
  private readonly destroyRef = inject(DestroyRef);

  private readonly confirmation = inject(ConfirmationService);
  private readonly messageService = inject(MessageService);

  readonly isDeleting = signal(false);
  readonly deleteIndex$ = new Subject<number>();

  private readonly images = this.data.images;
  private readonly currentIndex = signal(this.data.currentIndex);

  readonly currentImage = computed(() => this.images()[this.currentIndex()]);

  readonly favoriteIndex$ = new Subject<number>();

  prev(): void {
    const newIndex = (this.currentIndex() - 1 + this.images().length) % this.images().length;
    this.currentIndex.set(newIndex);
  }

  next(): void {
    const newIndex = (this.currentIndex() + 1) % this.images().length;
    this.currentIndex.set(newIndex);
  }

  close(): void {
    this.favoriteIndex$.complete();
    this.dialogRef.close();
  }

  confirmDelete(event: Event): void {
    event.stopPropagation();

    this.confirmation.confirm({
      key: 'deleteImage',
      header: 'Удалить фото?',
      message: `Вы действительно хотите удалить «${this.fileName()}»? Действие необратимо.`,
      acceptLabel: 'Удалить',
      rejectLabel: 'Отмена',
      icon: 'pi pi-exclamation-triangle',
      accept: () => this.deleteCurrentImage(),
    });
  }

  async downloadImage(event: Event): Promise<void> {
    event.stopPropagation();

    const url = this.currentImage().link;
    const name = this.fileName();

    try {
      // грузим картинку как blob
      const resp = await fetch(url, { mode: 'cors' });
      if (!resp.ok) throw new Error(`Ошибка загрузки ${resp.status}`);

      const blob = await resp.blob();

      // создаём временный объект-ссылку
      const blobUrl = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = name; // имя файла
      document.body.appendChild(a);
      a.click();

      // очищаем
      a.remove();
      URL.revokeObjectURL(blobUrl);
    } catch (e) {
      console.error('Не удалось скачать файл', e);
    }
  }

  private deleteCurrentImage(): void {
    if (this.isDeleting()) return;
    this.isDeleting.set(true);

    const img = this.currentImage();

    // пример API-вызова
    // this.imageApi.delete(img.id ?? img.link)
    //   .pipe(
    //     finalize(() => this.isDeleting.set(false)),
    //     takeUntilDestroyed()
    //   )
    //   .subscribe({
    //     next: () => {
    //       this.messageService.add({ severity: 'success', summary: 'Удалено', detail: this.fileName() });
    //       this.deleteIndex$.next(this.currentIndex());
    //     },
    //     error: (err) => {
    //       this.messageService.add({ severity: 'error', summary: 'Ошибка удаления', detail: String(err) });
    //     }
    //   });

    // временный мок, пока нет бэка:
    setTimeout(() => {
      this.isDeleting.set(false);
      this.messageService.add({ severity: 'success', summary: 'Удалено', detail: this.fileName() });
      this.deleteIndex$.next(this.currentIndex());
    }, 400);
  }

  onToggleFavorite(event: Event): void {
    event.stopPropagation();
    this.favoriteIndex$.next(this.currentIndex());
  }

  readonly fileName = computed(() => {
    const parts = this.currentImage().link.split('/');
    return parts[parts.length - 1];
  });

  showSlider(): void {
    this.modalService
      .openImageSlider({
        images: this.images,
        currentIndex: this.currentIndex,
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((finalIndex) => {
        this.currentIndex.set(finalIndex);
      });
  }
}
