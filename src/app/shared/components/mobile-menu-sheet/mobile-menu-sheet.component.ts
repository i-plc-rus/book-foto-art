import { Component, DestroyRef, inject, signal } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DesignService } from '../../../module/design-component/service/design.service';
import { TabsComponent } from '../tabs/tabs.component';
import { NgIf } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-mobile-menu-sheet',
  templateUrl: './mobile-menu-sheet.component.html',
  styleUrl: './mobile-menu-sheet.component.css',
  imports: [
    TabsComponent,
    NgIf
  ],
  providers: [DesignService]
})
export class MobileMenuSheetComponent {
  activeView = signal<'tabs' | 'design-sections'>('tabs');
  private router = inject(Router);
  private bottomSheetRef = inject(MatBottomSheetRef<MobileMenuSheetComponent>);
  private destroyRef = inject(DestroyRef);
  designService = inject(DesignService);

  constructor() {
    this.determineInitialView();

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(() => {
      this.determineInitialView();
    });
  }

  private determineInitialView() {
    if (this.router.url.startsWith('/design')) {
      this.activeView.set('design-sections');
    } else {
      this.activeView.set('tabs');
    }
  }

  showDesignSections() {
    this.activeView.set('design-sections');
  }

  showTabs() {
    this.activeView.set('tabs');
  }

  closeMenu() {
    this.bottomSheetRef.dismiss();
  }

  // Новый метод для обработки выбора раздела
  selectSection(sectionId: string) {
    this.designService.navigateToSection(sectionId);
    this.closeMenu(); // Закрываем меню после выбора
  }
}
