import { Component, signal } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  imports: [NgClass],
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent {
  activeMenuId = signal<string>('collections');

  menuItems = [
    { id: 'collections', title: 'Коллекции', icon: 'collections' },
    { id: 'favorites', title: 'Избранное', icon: 'favorites' },
    { id: 'home', title: 'Домашняя страница', icon: 'home' },
    { id: 'settings', title: 'Настройки', icon: 'settings' },
  ];

  setActiveMenu(id: string) {
    this.activeMenuId.set(id);
  }
}
