import { NgClass } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import type { MenuItem } from 'primeng/api';
import { Menu } from 'primeng/menu';

import { AuthService } from '../../core/service/auth.service';

@Component({
  standalone: true,
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  imports: [NgClass, Menu],
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent {
  private readonly authService: AuthService = inject(AuthService);
  activeMenuId = signal<string>('collections');

  menuItems = [
    { id: 'collections', title: 'Коллекции', icon: 'collections' },
    /* { id: 'favorites', title: 'Избранное', icon: 'favorites' },
    { id: 'home', title: 'Домашняя страница', icon: 'home' },
    { id: 'settings', title: 'Настройки', icon: 'settings' },*/
  ];

  readonly profileMenuItems: MenuItem[] = [
    { label: 'Выход', icon: 'pi pi-sign-out', command: () => this.logout() },
  ];

  setActiveMenu(id: string): void {
    this.activeMenuId.set(id);
  }

  logout(): void {
    this.authService.logout();
  }
}
