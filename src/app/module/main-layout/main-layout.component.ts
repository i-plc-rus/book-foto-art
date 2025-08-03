import {Component, inject, signal, OnDestroy, DestroyRef} from '@angular/core';
import {DatePipe, Location, NgComponentOutlet} from '@angular/common';
import {RouterOutlet, Router, NavigationEnd, ActivatedRoute} from '@angular/router';
import {TabsComponent} from '../../shared/components/tabs/tabs.component';
import {SidebarService} from '../../core/service/sidebar.service';
import {DesignService} from '../design-component/service/design.service';
import {filter, Subscription} from 'rxjs';
import {CollectionStateService} from '../../gallery-upload/service/collection-state.service';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

@Component({
  standalone: true,
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.css',
  imports: [
    RouterOutlet,
    TabsComponent,
    DatePipe,
    NgComponentOutlet
  ],
  providers: [SidebarService, DesignService, CollectionStateService]
})
export class MainLayoutComponent implements OnDestroy {
  private readonly location = inject(Location);
  private readonly router = inject(Router);
  readonly sidebarService = inject(SidebarService);
  readonly designService = inject(DesignService);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);
  private readonly collectionStateService = inject(CollectionStateService);

  coverUrl = this.collectionStateService.coverUrl;
  collectionId = signal<string | null>(null);
  isDesignRoute = signal(false);
  isPhotosRoute = signal(false);
  imageUrl = signal<string | null>(null);

  private readonly routerEventsSubscription: Subscription;

  constructor() {
    this.routerEventsSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.updateRouteState();
      });

    this.route.queryParams
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(params => {
        const collectionId = params['collectionId'] || null;
        this.collectionId.set(collectionId);

        if (collectionId) {
          this.collectionStateService.setCurrentCollectionId(collectionId);
        } else {
          this.collectionStateService.getCurrentCollectionId().subscribe(savedId => {
            if (savedId && this.router.url === '/upload') {
              this.router.navigate([], {
                relativeTo: this.route,
                queryParams: {collectionId: savedId},
                queryParamsHandling: 'merge'
              });
            }
          });
        }
      });
    this.updateRouteState();
  }

  ngOnDestroy() {
    if (this.routerEventsSubscription) {
      this.routerEventsSubscription.unsubscribe();
    }
  }

  navigateToPage() {
    this.router.navigate(['/design/cover']);
  }

  private updateRouteState() {
    const path = this.location.path();

    const isDesign = path.includes('/design');
    const isPhotos = path.startsWith('/upload');

    this.isDesignRoute.set(isDesign);
    this.isPhotosRoute.set(isPhotos);

    if (!isDesign) {
      this.designService.setSectionTitle('DESIGN');
    }
  }

  goBackToPreviousPage() {
    this.location.back();
  }
}
