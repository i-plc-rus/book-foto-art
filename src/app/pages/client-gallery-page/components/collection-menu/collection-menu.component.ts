import {
  ChangeDetectionStrategy,
  Component,
  output,
  signal,
} from '@angular/core';
import { NgClickOutsideDirective } from 'ng-click-outside2';

@Component({
  selector: 'app-collection-menu',
  templateUrl: './collection-menu.component.html',
  styleUrls: ['./collection-menu.component.scss'],
  imports: [NgClickOutsideDirective],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CollectionMenuComponent {
  readonly delete = output<void>();

  readonly isMenuOpen = signal(false);

  toggleMenu() {
    this.isMenuOpen.update((v) => !v);
  }

  closeMenu() {
    this.isMenuOpen.set(false);
  }

  onDeleteClick() {
    this.delete.emit();
    this.closeMenu();
  }
}
