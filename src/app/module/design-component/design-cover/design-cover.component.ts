import {Component, computed, OnInit, signal} from '@angular/core';
import { CommonModule } from '@angular/common';
import {ActionBarComponent} from "../../../shared/components/editor-action-bar/editor-action-bar.component";
import {IActionBarItem} from "../../../shared/components/editor-action-bar/action-bar-item";
import {DevicePreviewComponent} from "../../../shared/components/device-preview/device-preview.component";
import {ACTION_BAR_ITEMS, COVER_TEMPLATES} from "./design-cover.constants";
import {CoverTemplate} from "./cover-template";

@Component({
  standalone: true,
  selector: 'app-design-cover',
  templateUrl: './design-cover.component.html',
  styleUrl: './design-cover.component.css',
  imports: [CommonModule, ActionBarComponent, DevicePreviewComponent]
})
export class DesignCoverComponent implements OnInit{
  templates = signal<CoverTemplate[]>(COVER_TEMPLATES);
  actionBarItems = ACTION_BAR_ITEMS;

  isPreviewDisabled = false;
  isPublishDisabled = true;

  selectedTemplate = signal<CoverTemplate | null>(null);
  viewMode = signal<'desktop' | 'icon-m'>('desktop');
  itemsToShow = signal(6);

  containerWidth = computed(() =>
      this.viewMode() === 'icon-m' ? 'w-[280px]' : 'w-[420px]'
  );

  regularTemplates = computed(() =>
      this.templates().filter(t => t.id !== 'none')
  );

  visibleTemplates = computed(() =>
      this.regularTemplates().slice(0, this.itemsToShow())
  );

  noneTemplate = computed(() =>
      this.templates().find(t => t.id === 'none')!
  );

  ngOnInit() {
    if (this.templates().length > 0) {
      this.selectedTemplate.set(this.templates()[0]);
    }
  }

  handleMenuItem(item: IActionBarItem): void {
    console.log('Menu item clicked:', item);
    switch(item.id) {
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

  isSelected(template: CoverTemplate): boolean {
    return this.selectedTemplate()?.id === template.id;
  }

  selectTemplate(template: CoverTemplate) {
    this.selectedTemplate.set(template);
  }

  setViewMode(mode: 'desktop' | 'icon-m') {
    this.viewMode.set(mode);
  }

  loadMore() {
    this.itemsToShow.set(this.itemsToShow() + 6);
  }

  hasMore(): boolean {
    return this.itemsToShow() < this.regularTemplates().length;
  }
}
