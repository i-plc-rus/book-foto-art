import { NgClass } from '@angular/common';
import { Component, EventEmitter, inject, Output, signal } from '@angular/core';
import type { MenuItem } from 'primeng/api';

import { AuthService } from '../../../core/service/auth.service';
import { Menu } from 'primeng/menu';

export type SidebarMenu = 'collections' | 'favorites' | 'home' | 'settings';

@Component({
  standalone: true,
  selector: 'app-mobile-header',
  templateUrl: './mobile-header.component.html',
  imports: [NgClass, Menu],
  styleUrls: ['./mobile-header.component.css'],
})
export class MobileHeaderComponent {
  private readonly authService: AuthService = inject(AuthService);

  activeTab = signal<any>('collections');

  tabs = [
    { id: 'collections', title: 'Collections' },
    { id: 'starred', title: 'Starred' },
    { id: 'settings', title: 'Settings' },
    { id: 'homepage', title: 'Homepage' },
  ];

  readonly profileMenuItems: MenuItem[] = [
    { label: 'Выход', icon: 'pi pi-sign-out', command: () => this.logout() },
  ];

  @Output() tabChange = new EventEmitter<any>();

  selectTab(tab: any): void {
    this.activeTab.set(tab);
    this.tabChange.emit(tab);
  }

  logout(): void {
    this.authService.logout();
  }
}
