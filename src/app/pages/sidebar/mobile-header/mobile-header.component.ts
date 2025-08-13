import { Component, EventEmitter, Output, signal } from '@angular/core';
import { NgClass } from '@angular/common';

export type SidebarMenu = 'collections' | 'favorites' | 'home' | 'settings';

@Component({
  standalone: true,
  selector: 'app-mobile-header',
  templateUrl: './mobile-header.component.html',
  imports: [NgClass],
  styleUrls: ['./mobile-header.component.css'],
})
export class MobileHeaderComponent {
  activeTab = signal<any>('collections');

  tabs = [
    { id: 'collections', title: 'Collections' },
    { id: 'starred', title: 'Starred' },
    { id: 'settings', title: 'Settings' },
    { id: 'homepage', title: 'Homepage' },
  ];

  @Output() tabChange = new EventEmitter<any>();

  selectTab(tab: any) {
    this.activeTab.set(tab);
    this.tabChange.emit(tab);
  }
}
