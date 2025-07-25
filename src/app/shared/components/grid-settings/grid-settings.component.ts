import { Component, ElementRef, EventEmitter, HostListener, Output, signal, viewChild } from '@angular/core';

interface GridSizeOption {
  value: 'small' | 'large';
  label: string;
}

@Component({
  selector: 'app-grid-settings',
  standalone: true,
  templateUrl: './grid-settings.component.html',
})
export class GridSettingsComponent {
  menuButton = viewChild<ElementRef>('menuButton');
  menuPanel = viewChild<ElementRef>('menuPanel');
  @Output() gridSizeChange = new EventEmitter<'small' | 'large'>();
  @Output() showFilenameChange = new EventEmitter<boolean>();

  isOpen = signal(false);
  gridSize = signal<'small' | 'large'>('small');
  showFilename = signal(false);

  gridSizes: GridSizeOption[] = [
    { value: 'small', label: 'Small' },
    { value: 'large', label: 'Large' }
  ];

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

  setGridSize(size: 'small' | 'large') {
    this.gridSize.set(size);
    this.gridSizeChange.emit(size);
    this.isOpen.set(false);
  }

  toggleFilename() {
    this.showFilename.update(v => !v);
    this.showFilenameChange.emit(this.showFilename());
  }
}
