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
import { ModalService } from '../../service/modal/modal.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

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
    const newIndex =
      (this.currentIndex() - 1 + this.images().length) % this.images().length;
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

  downloadImage(event: Event): void {
    event.stopPropagation();
    const link = document.createElement('a');
    link.href = this.currentImage().link;
    link.download = this.fileName();
    link.click();
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
