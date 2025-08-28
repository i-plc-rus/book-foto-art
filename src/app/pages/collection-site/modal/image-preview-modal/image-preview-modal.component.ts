import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { Subject } from 'rxjs';
import { ImagePreviewData } from '../../model/image-preview.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ModalService } from '../../../../shared/service/modal/modal.service';

@Component({
  selector: 'app-image-preview-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './image-preview-modal.component.html',
  styleUrls: ['./image-preview-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImagePreviewModalComponent {
  private readonly modalService = inject(ModalService);
  private readonly dialogRef = inject(DialogRef);
  private readonly data = inject<ImagePreviewData>(DIALOG_DATA);
  private readonly destroyRef = inject(DestroyRef);

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
