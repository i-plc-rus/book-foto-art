import {Component, DestroyRef, inject, OnInit, signal} from '@angular/core';
import {ActivatedRoute, Router, RouterLink, RouterLinkActive} from '@angular/router';
import { CollectionStateService } from '../../../gallery-upload/service/collection-state.service';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {CollectionService} from '../../../gallery-upload/service/collection.service';

@Component({
  standalone: true,
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrl: './tabs.component.css',
  imports: [
    RouterLink,
    RouterLinkActive
  ],
  providers: [CollectionService]
})
export class TabsComponent implements OnInit{
  hoveredTab: string | null = null;
  private collectionStateService = inject(CollectionStateService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);
  private designService = inject(CollectionService);

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

  ngOnInit(): void {
    this.route.queryParams
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(params => {
        const collectionId = params['collectionId'] || null;
        this.currentCollectionId = collectionId;


        const currentUrl = this.router.url;
        const isMatchingTab = this.tabs.some(tab => currentUrl.startsWith(tab.link));

        if (collectionId && isMatchingTab) {
          this.loadCollectionData(collectionId);
        }
      });
  }

  loadCollectionData(collectionId: string) {
    this.designService.getPhotosIngo(collectionId);
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
    if (this.currentCollectionId) {
      this.router.navigate([tab.link], {
        queryParams: { collectionId: this.currentCollectionId }
      });
    } else {
      this.router.navigate([tab.link]);
    }
  }

}
