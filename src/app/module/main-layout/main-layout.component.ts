import { Component, inject, signal, DestroyRef } from '@angular/core';
import { DatePipe, Location } from '@angular/common';
import { RouterOutlet, Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { TabsComponent } from '../../shared/components/tabs/tabs.component';
import { DesignService } from '../design-component/service/design.service';
import { filter } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CollectionService } from '../../gallery-upload/service/collection.service';
import { environment as env } from '../../../environments/environment';
import { MobileHeaderComponent } from '../../shared/components/mobile-header/mobile-header.component';
import { DesignSectionsComponent } from '../../shared/components/design-sections/design-sections.component';
import { CollectionStateService } from '../../gallery-upload/service/collection-state.service';

interface CollectionData {
  name: string;
  date: string;
  cover_url: string;
  focal_point?: { x: number; y: number };
}

@Component({
  standalone: true,
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.css',
  imports: [RouterOutlet, TabsComponent, DatePipe, MobileHeaderComponent, DesignSectionsComponent],
  providers: [DesignService, CollectionService],
})
export class MainLayoutComponent {
  private readonly location = inject(Location);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);
  private readonly photoService = inject(CollectionService);
  private readonly collectionStateService = inject(CollectionStateService);

  collectionData = signal<CollectionData | null>(null);
  collectionId = signal<string | null>(null);
  isDesignRoute = signal(false);
  isPhotosRoute = signal(false);

  constructor() {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => this.updateRouteState());

    this.route.queryParams.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
      const collectionId = params['collectionId'] || null;
      this.collectionId.set(collectionId);
      if (collectionId) {
        this.loadCollectionData(collectionId);
      }
    });

    this.updateRouteState();
  }

  private loadCollectionData(collectionId: string): void {
    this.photoService
      .getPhotosIngo(collectionId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((res: any) => {
        if (!res.focal_point) {
          res.focal_point = { x: 50, y: 50 };
        }
        this.collectionData.set(res);
        this.collectionStateService.setCurrentCollectionId(collectionId);
      });
  }

  private updateRouteState() {
    const path = this.location.path();
    this.isDesignRoute.set(path.includes('/design'));
    this.isPhotosRoute.set(path.startsWith('/upload'));
  }

  navigateToPage() {
    const id = this.collectionId();
    if (id) {
      this.router
        .navigate(['/design/cover'], {
          queryParams: { collectionId: id },
        })
        .catch();
    }
  }

  goBackToPreviousPage() {
    this.router.navigate(['/client-gallery']).catch();
  }

  get coverImageUrl(): string | null {
    const cover = this.collectionData()?.cover_url ?? null;
    if (!cover) return null;
    if (cover.startsWith('http')) return cover;
    return env.apiUrl + cover;
  }

  updateFocalPoint(position: { x: number; y: number }) {
    const currentData = this.collectionData();
    if (currentData) {
      this.collectionData.set({
        ...currentData,
        focal_point: position,
      });
    }
  }
}
