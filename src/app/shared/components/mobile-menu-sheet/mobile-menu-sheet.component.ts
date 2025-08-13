import { NgIf } from '@angular/common';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

import { CollectionStateService } from '../../../gallery-upload/service/collection-state.service';
import type { DesignSection } from '../../../module/design-component/service/design.service';
import { DesignService } from '../../../module/design-component/service/design.service';
import { TabsComponent } from '../tabs/tabs.component';

@Component({
  standalone: true,
  selector: 'app-mobile-menu-sheet',
  templateUrl: './mobile-menu-sheet.component.html',
  styleUrl: './mobile-menu-sheet.component.css',
  imports: [TabsComponent, NgIf],
  providers: [DesignService],
})
export class MobileMenuSheetComponent {
  activeView = signal<'tabs' | 'design-sections'>('tabs');
  private router = inject(Router);
  private bottomSheetRef = inject(MatBottomSheetRef<MobileMenuSheetComponent>);
  private destroyRef = inject(DestroyRef);
  designService = inject(DesignService);
  private collectionStateService = inject(CollectionStateService);

  constructor() {
    this.determineInitialView();

    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => {
        this.determineInitialView();
      });
  }

  private determineInitialView(): void {
    if (this.router.url.startsWith('/design')) {
      this.activeView.set('design-sections');
    } else {
      this.activeView.set('tabs');
    }
  }

  async showDesignSections(): Promise<void> {
    const collectionId = this.collectionStateService.getCurrentCollectionIdValue();

    if (collectionId) {
      await this.router.navigate(['/design', 'cover'], {
        queryParams: { collectionId },
      });
    } else {
      await this.router.navigate(['/design', 'cover']);
    }

    this.activeView.set('design-sections');
  }

  closeMenu(): void {
    this.bottomSheetRef.dismiss();
  }

  async selectSection(sectionId: string): Promise<void> {
    const collectionId = this.collectionStateService.getCurrentCollectionIdValue();

    if (collectionId) {
      await this.router.navigate(['/design', sectionId], {
        queryParams: { collectionId },
      });
    } else {
      await this.router.navigate(['/design', sectionId]);
    }

    this.closeMenu();
  }

  isActiveSession(section: DesignSection): boolean {
    return this.designService.getActiveSection()?.id === section.id;
  }
}
