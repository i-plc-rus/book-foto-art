import { Component, inject, Output, EventEmitter, signal, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FocalPointComponent } from '../../../module/design-component/design-cover/focal-point/focal-point.component';
import { MainLayoutComponent } from '../../../module/main-layout/main-layout.component';
import { timer } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  standalone: true,
  selector: 'app-focal-point-modal',
  templateUrl: './focal-point-modal.component.html',
  styleUrls: ['./focal-point-modal.component.css'],
  imports: [CommonModule, FocalPointComponent],
})
export class FocalPointModalComponent {
  @Output() save = new EventEmitter<{ x: number; y: number }>();
  @Output() close = new EventEmitter<void>();

  showSuccessMessage = signal(false);

  mainLayout = inject(MainLayoutComponent);
  destroyRef = inject(DestroyRef);

  currentPosition = this.mainLayout.collectionData()?.focal_point || { x: 50, y: 50 };

  get imageUrl(): string {
    return this.mainLayout.coverImageUrl || '';
  }

  handlePositionChange(position: { x: number; y: number }) {
    this.currentPosition = position;
    this.updateMainLayoutPosition();
  }

  private updateMainLayoutPosition() {
    const currentData = this.mainLayout.collectionData();
    if (currentData) {
      this.mainLayout.collectionData.set({
        ...currentData,
        focal_point: this.currentPosition,
      });

      this.showSuccessMessage.set(true);

      timer(1800)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(() => {
          this.showSuccessMessage.set(false);
        });
    }
  }
}
