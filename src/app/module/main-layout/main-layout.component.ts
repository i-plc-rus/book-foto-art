import { Component, inject, signal, effect, OnDestroy } from '@angular/core';
import { DatePipe, Location, NgComponentOutlet } from '@angular/common';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { TabsComponent } from '../../shared/components/tabs/tabs.component';
import { SidebarService } from '../../core/service/sidebar.service';
import { DesignService } from '../design-component/service/design.service';
import { filter, Subscription } from 'rxjs';

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
  providers: [SidebarService, DesignService]
})
export class MainLayoutComponent implements OnDestroy {
  private readonly location = inject(Location);
  private readonly router = inject(Router);
  readonly sidebarService = inject(SidebarService);
  readonly designService = inject(DesignService);

  isDesignRoute = signal(false);
  private readonly routerEventsSubscription: Subscription;

  constructor() {
    // Подписываемся на изменения роутера
    this.routerEventsSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.updateRouteState();
      });

    // Инициализируем состояние при создании компонента
    this.updateRouteState();
  }

  ngOnDestroy() {
    if (this.routerEventsSubscription) {
      this.routerEventsSubscription.unsubscribe();
    }
  }

  private updateRouteState() {
    const path = this.location.path();
    const isDesign = path.includes('/design');

    this.isDesignRoute.set(isDesign);

    if (!isDesign) {
      this.designService.setSectionTitle('DESIGN');
    }
  }

  goBackToPreviousPage() {
    this.location.back();
  }
}
