import {Component, ElementRef, EventEmitter, HostListener, Output, signal, viewChild} from '@angular/core';
import {SORT_OPTION} from './sort-menu.constants';
import {ISortOption} from './interface/sort-option';

@Component({
  selector: 'app-sort-menu',
  standalone: true,
  templateUrl: './sort-menu.component.html',
})
export class SortMenuComponent {
  @Output() sortChange = new EventEmitter<string>();
  menuButton = viewChild<ElementRef>('menuButton');
  menuPanel = viewChild<ElementRef>('menuPanel');

  isOpen = signal(false);
  selected = signal<string>('uploaded_new');
  sortOptions: ISortOption[] = SORT_OPTION;

  @HostListener('document:click', ['$event'])
  handleDocumentClick(event: MouseEvent): void {
    if (!this.isOpen()) return;

    const clickedInsideButton = this.menuButton()?.nativeElement.contains(event.target as Node);
    const clickedInsideMenu = this.menuPanel()?.nativeElement.contains(event.target as Node);

    if (!clickedInsideButton && !clickedInsideMenu) {
      this.isOpen.set(false);
    }
  }

  toggleMenu() {
    this.isOpen.update(v => !v);
  }

  select(option: string) {
    this.selected.set(option);
    this.sortChange.emit(option);
    this.isOpen.set(false);
  }
}
