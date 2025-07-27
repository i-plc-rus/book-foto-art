import { Component, input, output, signal } from '@angular/core';
import { NgClickOutsideDirective } from 'ng-click-outside2';

@Component({
  selector: 'app-collection-menu',
  standalone: true,
  templateUrl: './collection-menu.component.html',
  styleUrls: ['./collection-menu.component.scss'],
  imports: [NgClickOutsideDirective],
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
