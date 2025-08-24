import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { PrimeTemplate } from 'primeng/api';
import { Button } from 'primeng/button';
import { Dialog } from 'primeng/dialog';

/**
 * Диалоговое окно перед публикацией
 */
@Component({
  selector: 'app-publish-confirm-dialog',
  imports: [Dialog, Button, PrimeTemplate, Dialog],
  templateUrl: './publish-confirm-dialog.component.html',
  styleUrl: './publish-confirm-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PublishConfirmDialogComponent {
  readonly visible = input<boolean>(false);

  readonly publishAction = output<void>();
  readonly cancelAction = output<void>();

  private readonly illustrationSrc: string = 'assets/images/publish/woman-reading.jpg';

  onCancel(): void {
    this.cancelAction.emit();
  }

  onPublish(): void {
    this.publishAction.emit();
  }

  get imageSrc(): string {
    return this.illustrationSrc;
  }

  onVisibleChange(isVisible: boolean): void {
    if (!isVisible) {
      this.onCancel();
    }
  }
}
