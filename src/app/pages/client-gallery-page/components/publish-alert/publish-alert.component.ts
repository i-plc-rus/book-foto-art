import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { PrimeTemplate } from 'primeng/api';
import { Button } from 'primeng/button';
import { Dialog } from 'primeng/dialog';

@Component({
  selector: 'app-publish-alert',
  imports: [Dialog, Button, PrimeTemplate],
  templateUrl: './publish-alert.component.html',
  styleUrl: './publish-alert.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PublishAlertComponent {
  /** Управляет видимостью диалога (контролируется родителем) */
  @Input({ required: true }) visible!: boolean;

  /** Необязательные данные для текста/превью */
  @Input() collectionName = '';
  @Input() previewSrc = 'assets/images/publish-preview.jpg';

  /** События наружу */
  @Output() publish = new EventEmitter<void>();
  @Output() cancelPublish = new EventEmitter<void>();
  @Output() visibleChange = new EventEmitter<boolean>();

  onHide(): void {
    this.visibleChange.emit(false);
    this.cancelPublish.emit();
  }

  onCancel(): void {
    this.visibleChange.emit(false);
    this.cancelPublish.emit();
  }

  onPublish(): void {
    this.publish.emit();
  }
}
