import { Component, input, model } from '@angular/core';
import { ISavedGallery } from '../../../../gallery-upload/interface/upload-file';
import { CollectionCardComponent } from '../collection-card/collection-card.component';

export type DisplayView = 'grid' | 'list';

@Component({
  selector: 'app-collection-display',
  standalone: true,
  imports: [CollectionCardComponent],
  templateUrl: './collection-display.component.html',
  styleUrls: ['./collection-display.component.scss'],
})
export class CollectionDisplayComponent {
  readonly viewMode = model.required<DisplayView>();
  readonly collections = input.required<ISavedGallery[]>();
}
