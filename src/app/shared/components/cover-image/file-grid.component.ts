import { Component, Input, Output, EventEmitter, HostListener, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuOption, UploadFile } from '../../../gallery-upload/interface/upload-file';

@Component({
  standalone: true,
  selector: 'app-file-grid',
  templateUrl: './file-grid.component.html',
  styleUrls: ['./file-grid.component.css'],
  imports: [CommonModule],
})
export class FileGridComponent {
  @Input() files: UploadFile[] | null = [];
  @Input() gridSize: 'small' | 'large' = 'small';
  @Input() showFilename = false;
  @Input() showEmptyState = false;
  @Input() menuOptions: MenuOption[] = [];

  @Output() filesDropped = new EventEmitter<File[]>();
  @Output() fileSelected = new EventEmitter<Event>();
  @Output() imageError = new EventEmitter<{ event: Event; file: UploadFile }>();
  @Output() menuItemClicked = new EventEmitter<{
    optionId: string;
    file: UploadFile;
  }>();

  menuOpenId = signal<string | null>(null);
  menuHoverId = signal<string | null>(null);

  handleDrop(event: DragEvent) {
    event.preventDefault();
    if (event.dataTransfer?.files.length) {
      this.filesDropped.emit([...event.dataTransfer.files]);
    }
  }

  handleFileSelect(event: Event) {
    this.fileSelected.emit(event);
  }

  handleImageError(event: Event, file: UploadFile) {
    this.imageError.emit({ event, file });
  }

  toggleMenu(fileId: string, event: MouseEvent) {
    event.stopPropagation();
    this.menuOpenId.set(this.menuOpenId() === fileId ? null : fileId);
  }

  onMenuOptionMouseEnter(optionId: string) {
    this.menuHoverId.set(optionId);
  }

  onMenuOptionMouseLeave() {
    this.menuHoverId.set(null);
  }

  handleOptionClick(optionId: string, file: UploadFile) {
    this.menuItemClicked.emit({ optionId, file });
    this.menuOpenId.set(null);
  }

  @HostListener('document:click', ['$event'])
  handleDocumentClick(event: MouseEvent) {
    if (!(event.target as HTMLElement).closest('.menu-container')) {
      this.menuOpenId.set(null);
    }
  }
}
