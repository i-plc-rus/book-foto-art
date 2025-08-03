import {
  Component,
  ChangeDetectionStrategy,
  computed,
  inject,
  signal,
  DestroyRef,
} from '@angular/core';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { ImageSliderData } from '../../model/image-preview.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { interval, Subject } from 'rxjs';

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

  readonly result$ = new Subject<number>();

  constructor() {
    interval(3500)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        const next = (this.currentIndex() + 1) % this.images().length;
        this.currentIndex.set(next);
        this.result$.next(next);
      });

    this.destroyRef.onDestroy(() => {
      this.result$.complete();
    });
  }

  onClose(): void {
    this.result$.complete();
    this.dialogRef.close();
  }
}
