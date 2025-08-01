import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CollectionStateService } from '../../../gallery-upload/service/collection-state.service';

@Component({
  standalone: true,
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrl: './tabs.component.css',
  imports: [
    RouterLink,
    RouterLinkActive
  ]
})
export class TabsComponent {
  hoveredTab: string | null = null;
  private collectionStateService = inject(CollectionStateService);
  private router = inject(Router);
  currentCollectionId: string | null = null;

  tabs = [
    {
      icon: 'assets/icons/images.svg',
      tooltip: 'Photos',
      link: '/upload'
    },
    {
      icon: 'assets/icons/icon-design.svg',
      tooltip: 'Design',
      link: '/design/cover'
    },
    {
      icon: 'assets/icons/setting.svg',
      tooltip: 'Settings',
      link: '/gallery/settings'
    },
    {
      icon: 'assets/icons/wifi.svg',
      tooltip: 'Activities',
      link: '/gallery/active'
    }
  ];

  constructor() {
    this.collectionStateService.getCurrentCollectionId().subscribe(id => {
      this.currentCollectionId = id;
    });
  }

  isActive(link: string): boolean {
    return this.router.isActive(link, {
      paths: 'subset',
      queryParams: 'subset',
      fragment: 'ignored',
      matrixParams: 'ignored'
    });
  }

  navigateToTab(tab: any) {
    if (tab.link === '/upload' && this.currentCollectionId) {
      this.router.navigate([tab.link], {
        queryParams: { collectionId: this.currentCollectionId }
      });
    } else {
      this.router.navigate([tab.link]);
    }
  }
}
