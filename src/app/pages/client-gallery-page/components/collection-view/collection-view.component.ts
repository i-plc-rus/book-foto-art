import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
import { NgClickOutsideDirective } from 'ng-click-outside2';
import { DisplayView } from '../../models/collection-display.model';

@Component({
  selector: 'app-collection-view',
  templateUrl: './collection-view.component.html',
  styleUrls: ['./collection-view.component.scss'],
  imports: [NgClickOutsideDirective],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CollectionViewComponent {
  readonly view = input.required<DisplayView>();
  readonly chooseView = output<DisplayView>();

  readonly isOpen = signal(false);

  toggleDropdown() {
    this.isOpen.update((v) => !v);
  }

  closeDropdown() {
    this.isOpen.set(false);
  }

  setView(view: DisplayView) {
    this.chooseView.emit(view);
    this.closeDropdown();
  }
}
