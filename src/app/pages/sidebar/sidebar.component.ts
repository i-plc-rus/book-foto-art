import { Component, EventEmitter, Output, signal } from '@angular/core';
import {NgForOf, NgSwitch, NgSwitchCase} from '@angular/common';

export type SidebarMenu = 'collections' | 'favorites' | 'home' | 'settings';

@Component({
  standalone: true,
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  imports: [
    NgSwitch,
    NgForOf,
    NgSwitchCase
  ],
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  menuItems = [
    { id: 'collections', title: 'Коллекции', icon: 'collections' },
    { id: 'favorites', title: 'Избранное', icon: 'favorites' },
    { id: 'home', title: 'Домашняя страница', icon: 'home' },
    { id: 'settings', title: 'Настройки', icon: 'settings' }
  ];
}
