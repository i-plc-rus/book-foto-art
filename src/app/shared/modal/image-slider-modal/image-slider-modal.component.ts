import {
  Component,
  ChangeDetectionStrategy,
  computed,
  inject,
  signal,
  effect,
  DestroyRef,
} from '@angular/core';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { ImageSliderData } from '../../model/image-preview.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter, fromEvent, interval, Subject } from 'rxjs';

@Component({
  selector: 'app-image-slider-modal',
  standalone: true,
  imports: [],
  templateUrl: './image-slider-modal.component.html',
  styleUrls: ['./image-slider-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImageSliderModalComponent {
  private readonly dialogRef = inject(DialogRef);
  private readonly data = inject<ImageSliderData>(DIALOG_DATA);
  private readonly destroyRef = inject(DestroyRef);

  readonly images = this.data.images;

  private readonly currentIndex = signal(this.data.currentIndex());

  readonly currentImage = computed(() => this.images()[this.currentIndex()]);

  constructor() {
    interval(3500)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        const nextIndex = (this.currentIndex() + 1) % this.images().length;
        this.currentIndex.set(nextIndex);
      });

    this.registerEscListener();
  }

  onClose(): void {
    this.dialogRef.close(this.currentIndex());
  }

  private registerEscListener() {
    fromEvent<KeyboardEvent>(window, 'keydown')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((event) => {
        console.log(event);
        if (event.key === 'Escape') {
          this.dialogRef.close(this.currentIndex());
        }
      });
  }
}
