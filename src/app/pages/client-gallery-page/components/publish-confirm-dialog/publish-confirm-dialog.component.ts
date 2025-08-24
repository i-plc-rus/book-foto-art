import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { PrimeTemplate } from 'primeng/api';
import { Button } from 'primeng/button';
import { Dialog } from 'primeng/dialog';

@Component({
  selector: 'app-publish-confirm-dialog',
  imports: [Dialog, Button, PrimeTemplate, Dialog],
  templateUrl: './publish-confirm-dialog.component.html',
  styleUrl: './publish-confirm-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PublishConfirmDialogComponent {
  // управляется только родителем
  readonly visible = input<boolean>(false);

  // не используем имена нативных событий
  readonly publishAction = output<void>();
  readonly cancelAction = output<void>();

  // путь к иллюстрации — поменяешь на свой
  private readonly illustrationSrc: string = 'assets/images/publish/ready-to-publish.png';

  onCancel(): void {
    this.cancelAction.emit();
  }

  onPublish(): void {
    this.publishAction.emit();
  }

  get imageSrc(): string {
    return this.illustrationSrc;
  }
}
