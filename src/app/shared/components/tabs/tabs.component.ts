import { Component, DestroyRef, EventEmitter, inject, Input, Output, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';

import { CollectionService } from '../../../gallery-upload/service/collection.service';
import { CollectionStateService } from '../../../gallery-upload/service/collection-state.service';

@Component({
  standalone: true,
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.css'],
  imports: [],
  providers: [CollectionService],
})
export class TabsComponent {
  @Input() isMobileMenu = false;
  @Output() designTabClick = new EventEmitter<void>();
  @Output() tabSelected = new EventEmitter<void>();

  hoveredTab = signal<string | null>(null);

  private collectionStateService = inject(CollectionStateService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);
  private designService = inject(CollectionService);

  currentCollectionId = signal<string | null>(null);

  tabs = [
    /*   { icon: 'assets/icons/images.svg', tooltip: 'Photos', link: '/upload' },*/
    { icon: 'assets/icons/icon-design.svg', tooltip: 'Дизайн', link: '/design/cover' },
    /*   { icon: 'assets/icons/setting.svg', tooltip: 'Settings', link: '/gallery/settings' },
    { icon: 'assets/icons/wifi.svg', tooltip: 'Activities', link: '/gallery/active' },*/
  ];

  constructor() {
    this.collectionStateService.getCurrentCollectionId().subscribe((id) => {
      this.currentCollectionId.set(id);
    });

    this.route.queryParams.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
      const collectionId = params['collectionId'] || null;
      this.currentCollectionId.set(collectionId);

      const currentUrl = this.router.url;
      const isMatchingTab = this.tabs.some((tab) => currentUrl.startsWith(tab.link));
      if (collectionId && isMatchingTab) {
        this.loadCollectionData(collectionId);
      }
    });
  }

  loadCollectionData(collectionId: string): void {
    this.designService.getPhotosIngo(collectionId);
  }

  isActive(link: string): boolean {
    // Для вкладки Design проверяем префикс
    if (link === '/design/cover') {
      return this.router.url.startsWith('/design');
    }

    return this.router.isActive(link, {
      paths: 'subset',
      queryParams: 'subset',
      fragment: 'ignored',
      matrixParams: 'ignored',
    });
  }

  async navigateToTab(tab: any): Promise<void> {
    if (this.isMobileMenu && tab.tooltip === 'Design') {
      this.designTabClick.emit();
      return;
    }

    // Навигация для других вкладок
    if (this.currentCollectionId()) {
      await this.router.navigate([tab.link], {
        queryParams: { collectionId: this.currentCollectionId() },
      });
    } else {
      await this.router.navigate([tab.link]);
    }

    this.tabSelected.emit();
  }
}
