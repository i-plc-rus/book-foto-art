import { Dialog, type DialogConfig, type DialogRef } from '@angular/cdk/dialog';
import { Overlay } from '@angular/cdk/overlay';
import type { ComponentType } from '@angular/cdk/portal';
import type { TemplateRef } from '@angular/core';
import { DestroyRef, inject, Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import type { Observable } from 'rxjs';
import { merge, take, takeLast, takeUntil } from 'rxjs';
import { map } from 'rxjs/operators';

import { ImagePreviewModalComponent } from '../../../pages/collection-site/modal/image-preview-modal/image-preview-modal.component';
import { ImageSliderModalComponent } from '../../../pages/collection-site/modal/image-slider-modal/image-slider-modal.component';
import type {
  ImagePreviewData,
  ImagePreviewEvent,
  ImageSliderData,
} from '../../../pages/collection-site/model/image-preview.model';
import { ImageEventType } from '../../../pages/collection-site/model/image-preview.model';
@Injectable({ providedIn: 'root' })
export class ModalService {
  private readonly dialog = inject(Dialog);
  private readonly overlay = inject(Overlay);
  private readonly destroyRef = inject(DestroyRef);

  open<R = unknown, D = unknown, C = unknown>(
    component: ComponentType<C> | TemplateRef<C>,
    config?: DialogConfig<D, DialogRef<R, C>>,
  ): DialogRef<R, C> {
    const positionStrategy = this.overlay.position().global().centerHorizontally();

    const dialogRef = this.dialog.open(component, {
      positionStrategy,
      panelClass: 'app-modal-panel',
      autoFocus: false,
      ...config,
    });

    if (!config?.disableClose) {
      dialogRef.outsidePointerEvents
        .pipe(take(1), takeUntil(dialogRef.closed), takeUntilDestroyed(this.destroyRef))
        .subscribe(() => dialogRef.close());
    }

    return dialogRef;
  }

  /**
   * Открывает модальное окно предпросмотра изображения (одиночное изображение).
   * Пользователь может выделить понравившееся изображение, и этот выбор будет эмитирован через `favoriteIndex$`.
   *
   * @param data - Данные для предпросмотра, включая список изображений и текущий индекс
   * @returns Observable<ImagePreviewEvent> - тип события и его индекс
   */

  previewImage(data: ImagePreviewData): Observable<ImagePreviewEvent> {
    const dialogRef = this.open<null, ImagePreviewData, ImagePreviewModalComponent>(
      ImagePreviewModalComponent,
      { data, panelClass: 'image-modal' },
    );

    const cmp = dialogRef.componentInstance!;
    return merge(
      cmp.favoriteIndex$.pipe(map((i) => ({ type: ImageEventType.favorite, index: i }) as const)),
      cmp.deleteIndex$.pipe(map((i) => ({ type: ImageEventType.delete, index: i }) as const)),
    );
  }

  /**
   * Открывает модальное окно-слайдер с авто-пролистыванием изображений.
   * Пока модалка открыта, она эмитирует индекс текущего изображения.
   * После закрытия модального окна, вернётся **последнее активное значение индекса**.
   *
   * Используется для передачи результата (последний просмотренный слайд).
   *
   * @param data - Данные для слайдера, включая изображения и стартовый индекс
   * @returns Observable<number> - Последний индекс изображения при закрытии модального окна
   */

  openImageSlider(data: ImageSliderData): Observable<number> {
    const dialogRef = this.open<number, ImageSliderData, ImageSliderModalComponent>(
      ImageSliderModalComponent,
      {
        data,
      },
    );

    return dialogRef.componentInstance!.result$.pipe(takeLast(1));
  }

  closeAll(): void {
    this.dialog.closeAll();
  }
}
