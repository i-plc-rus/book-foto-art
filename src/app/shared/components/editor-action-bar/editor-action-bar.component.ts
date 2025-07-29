import { Component, EventEmitter, Input, Output, HostListener, ViewChild, ElementRef } from '@angular/core';
import {IActionBarItem} from './action-bar-item';

@Component({
  standalone: true,
  selector: 'app-editor-action-bar',
  templateUrl: './editor-action-bar.component.html',
  styleUrls: ['./editor-action-bar.component.css']
})
export class ActionBarComponent {
  @Input() menuItems: IActionBarItem[] = [];
  @Input() previewDisabled = false;
  @Input() publishDisabled = true;
  @Input() previewLabel = 'Preview';
  @Input() publishLabel = 'Publish';

  @Output() menuItemClick = new EventEmitter<IActionBarItem>();
  @Output() buttonClick = new EventEmitter<'preview' | 'publish'>();

  @ViewChild('moreMenu') moreMenuRef!: ElementRef;

  isMenuOpen = false;

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  onMenuItemClick(item: IActionBarItem, event: Event): void {
    event.preventDefault();
    this.menuItemClick.emit(item);
    this.isMenuOpen = false;
  }

  onButtonClick(buttonType: 'preview' | 'publish'): void {
    this.buttonClick.emit(buttonType);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.moreMenuRef.nativeElement.contains(event.target)) {
      this.isMenuOpen = false;
    }
  }
}
