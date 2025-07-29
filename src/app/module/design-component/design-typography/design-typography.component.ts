import {Component, computed, signal} from '@angular/core';
import {ActionBarComponent} from "../../../shared/components/editor-action-bar/editor-action-bar.component";
import {DevicePreviewComponent} from "../../../shared/components/device-preview/device-preview.component";
import {CoverTemplate} from "../design-cover/cover-template";
import {IActionBarItem} from "../../../shared/components/editor-action-bar/action-bar-item";
import {TYPOGRAPHY_TEMPLATES, ACTION_BAR_ITEMS} from "./design-typography.constants";

@Component({
  standalone: true,
  selector: 'app-design-typography',
  templateUrl: './design-typography.component.html',
  styleUrl: './design-typography.component.css',
    imports: [
        ActionBarComponent,
        DevicePreviewComponent
    ]
})
export class DesignTypographyComponent {
    templates = signal<CoverTemplate[]>(TYPOGRAPHY_TEMPLATES);
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

}
