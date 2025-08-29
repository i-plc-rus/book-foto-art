import { Clipboard } from '@angular/cdk/clipboard';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';

import type { ShareCollectionData } from '../../models/collection-display.model';

@Component({
  selector: 'app-share-collection-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './share-collection-modal.component.html',
  styleUrls: ['./share-collection-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShareCollectionModalComponent {
  readonly data = inject<ShareCollectionData>(DIALOG_DATA);
  private readonly clipboard = inject(Clipboard);
  private readonly dialogRef = inject(DialogRef);

  readonly copied = signal(false);

  copyUrl(): void {
    this.clipboard.copy(this.data.url);
    this.copied.set(true);
    setTimeout(() => this.copied.set(false), 2000);
  }

  close(): void {
    this.dialogRef.close();
  }
}
