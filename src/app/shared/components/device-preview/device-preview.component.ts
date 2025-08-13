import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-device-preview',
  templateUrl: './device-preview.component.html',
  imports: [NgClass],
  styleUrls: ['./device-preview.component.css'],
})
export class DevicePreviewComponent {
  @Input() previewImage: string | null = null;
  @Input() viewMode: 'desktop' | 'icon-m' = 'desktop';
  @Input() placeholderText = 'Select a template to preview';
  @Input() desktopWidth = 'w-[420px]';
  @Input() mobileWidth = 'w-[280px]';

  @Output() viewModeChange = new EventEmitter<'desktop' | 'icon-m'>();

  get containerWidth(): string {
    return this.viewMode === 'icon-m' ? this.mobileWidth : this.desktopWidth;
  }

  setViewMode(mode: 'desktop' | 'icon-m'): void {
    this.viewMode = mode;
    this.viewModeChange.emit(mode);
  }
}
