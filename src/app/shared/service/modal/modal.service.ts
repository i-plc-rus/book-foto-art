import { Dialog, type DialogRef, type DialogConfig } from '@angular/cdk/dialog';
import { Overlay } from '@angular/cdk/overlay';
import type { ComponentType } from '@angular/cdk/portal';
import { TemplateRef, DestroyRef, Injectable, inject } from '@angular/core';
import { Observable, take, takeUntil } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ImagePreviewModalComponent } from '../../modal/image-preview-modal/image-preview-modal.component';
import { ImagePreviewData } from '../../model/image-preview.model';

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

  closeAll(): void {
    this.dialog.closeAll();
  }
}
