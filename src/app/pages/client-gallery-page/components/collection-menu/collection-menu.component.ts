import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
import { NgClickOutsideDirective } from 'ng-click-outside2';
import {
  CollectionActionPayload,
  CollectionActionType,
} from '../../models/collection-display.model';
import { ISavedGallery } from '../../../../gallery-upload/interface/upload-file';

@Component({
  selector: 'app-collection-menu',
  templateUrl: './collection-menu.component.html',
  styleUrls: ['./collection-menu.component.scss'],
  imports: [NgClickOutsideDirective],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CollectionMenuComponent {
  readonly collection = input.required<ISavedGallery>();
  readonly action = output<CollectionActionPayload>();

  readonly actionType = CollectionActionType;

  readonly isMenuOpen = signal(false);

  toggleMenu() {
    this.isMenuOpen.update((v) => !v);
  }

  closeMenu() {
    this.isMenuOpen.set(false);
  }

  onActionClick(actionKey: CollectionActionType): void {
    this.closeMenu();
    this.action.emit({ actionKey, item: this.collection() });
  }
}
