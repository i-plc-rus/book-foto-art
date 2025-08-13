import { Component, signal } from '@angular/core';
import { ActionBarComponent } from '../../../shared/components/editor-action-bar/editor-action-bar.component';
import { DevicePreviewComponent } from '../../../shared/components/device-preview/device-preview.component';
import { IActionBarItem } from '../../../shared/components/editor-action-bar/action-bar-item';
import { ACTION_BAR_ITEMS, GRID_GROUPS } from './design-grid.constants';
import { GridItem } from './grid-group';

@Component({
  standalone: true,
  selector: 'app-design-grid',
  templateUrl: './design-grid.component.html',
  styleUrl: './design-grid.component.css',
  imports: [ActionBarComponent, DevicePreviewComponent],
})
export class DesignGridComponent {
  gridGroups = signal(GRID_GROUPS);
  selectedItems = signal<GridItem[]>([]);
  actionBarItems = ACTION_BAR_ITEMS;

  isPreviewDisabled = false;
  isPublishDisabled = true;
  viewMode = signal<'desktop' | 'icon-m'>('desktop');

  isSelected(item: GridItem): boolean {
    return this.selectedItems().some((selected) => selected.id === item.id);
  }

  selectItem(item: GridItem) {
    const group = this.gridGroups().find((g) => g.items.some((i) => i.id === item.id));

    if (!group) return;

    const newSelection = this.selectedItems().filter(
      (selected) => !group.items.some((i) => i.id === selected.id),
    );

    newSelection.push(item);
    this.selectedItems.set(newSelection);
  }

  handleMenuItem(item: IActionBarItem): void {
    console.log('Menu item clicked:', item);
    switch (item.id) {
      case 'get-link':
        this.getDirectLink();
        break;
      case 'delete':
        this.deleteCollection();
        break;
    }
  }

  handleButtonClick(type: 'preview' | 'publish'): void {
    if (type === 'preview') {
      this.preview();
    } else {
      this.publish();
    }
  }

  preview(): void {
    console.log('Preview action');
  }

  publish(): void {
    console.log('Publish action');
  }

  getDirectLink(): void {
    console.log('Getting direct link');
  }

  deleteCollection(): void {
    console.log('Deleting collection');
  }

  setViewMode(mode: 'desktop' | 'icon-m') {
    this.viewMode.set(mode);
  }
}
