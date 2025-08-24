import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { MessageService, PrimeTemplate } from 'primeng/api';
import { Button } from 'primeng/button';
import { Dialog } from 'primeng/dialog';

import type { IPublishResponse } from '../../../../interfaces/collection.interface';
import { Toast } from 'primeng/toast';

/**
 * Диалоговое окно перед публикацией
 */
@Component({
  selector: 'app-publish-confirm-dialog',
  imports: [Dialog, Button, PrimeTemplate, Dialog, Toast],
  templateUrl: './publish-confirm-dialog.component.html',
  styleUrl: './publish-confirm-dialog.component.scss',
  providers: [MessageService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PublishConfirmDialogComponent {
  private readonly messageService: MessageService = inject(MessageService);
  readonly visible = input<boolean>(false);
  readonly loading = input<boolean>(false);
  readonly publishResponse = input<IPublishResponse | null>(null);

  readonly publishAction = output<void>();
  readonly cancelAction = output<void>();

  readonly hideCompleted = output<void>();

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
      setTimeout(() => this.hideCompleted.emit(), 100);
    }
  }

  copyLink(): void {
    const link = this.publishResponse()?.link;
    if (link) {
      navigator.clipboard
        .writeText(link)
        .then(() => {
          this.messageService.add({
            severity: 'success',
            summary: 'Скопировано',
            detail: 'Ссылка успешно скопирована в буфер обмена',
            life: 2000,
          });
        })
        .catch(() => {
          console.warn('Не удалось скопировать ссылку');
        });
    }
  }
}
