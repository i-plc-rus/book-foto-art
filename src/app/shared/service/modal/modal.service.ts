import { Dialog, type DialogRef, type DialogConfig } from '@angular/cdk/dialog';
import { Overlay } from '@angular/cdk/overlay';
import type { ComponentType } from '@angular/cdk/portal';
import { TemplateRef, DestroyRef, Injectable, inject } from '@angular/core';
import { Observable, take, takeLast, takeUntil } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ImagePreviewModalComponent } from '../../modal/image-preview-modal/image-preview-modal.component';
import {
  ImagePreviewData,
  ImageSliderData,
} from '../../model/image-preview.model';
import { ImageSliderModalComponent } from '../../modal/image-slider-modal/image-slider-modal.component';

@Injectable({ providedIn: 'root' })
export class ModalService {
  private readonly dialog = inject(Dialog);
  private readonly overlay = inject(Overlay);
  private readonly destroyRef = inject(DestroyRef);

  open<R = unknown, D = unknown, C = unknown>(
    component: ComponentType<C> | TemplateRef<C>,
    config?: DialogConfig<D, DialogRef<R, C>>
  ): DialogRef<R, C> {
    const positionStrategy = this.overlay
      .position()
      .global()
      .centerHorizontally();

    const dialogRef = this.dialog.open(component, {
      positionStrategy,
      panelClass: 'app-modal-panel',
      autoFocus: false,
      ...config,
    });

    if (!config?.disableClose) {
      dialogRef.outsidePointerEvents
        .pipe(
          take(1),
          takeUntil(dialogRef.closed),
          takeUntilDestroyed(this.destroyRef)
        )
        .subscribe(() => dialogRef.close());
    }

    return dialogRef;
  }

  /**
   * Открывает модальное окно предпросмотра изображения (одиночное изображение).
   * Пользователь может выделить понравившееся изображение, и этот выбор будет эмитирован через `favoriteIndex$`.
   *
   * @param data - Данные для предпросмотра, включая список изображений и текущий индекс
   * @returns Observable<number> - Индекс изображения, которое пользователь отметил как избранное
   */

  previewImage(data: ImagePreviewData): Observable<number> {
    const dialogRef = this.open<
      null,
      ImagePreviewData,
      ImagePreviewModalComponent
    >(ImagePreviewModalComponent, {
      data,
      panelClass: 'image-modal',
    });

    return dialogRef.componentInstance!.favoriteIndex$.asObservable();
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
    const dialogRef = this.open<
      number,
      ImageSliderData,
      ImageSliderModalComponent
    >(ImageSliderModalComponent, {
      data,
    });

    return dialogRef.componentInstance!.result$.pipe(takeLast(1));
  }

  closeAll(): void {
    this.dialog.closeAll();
  }
}
