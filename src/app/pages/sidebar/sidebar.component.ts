import {Component, EventEmitter, Output, signal} from '@angular/core';

export type SidebarMenu = 'collections' | 'favorites' | 'home' | 'settings';

@Component({
  standalone: true,
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
  imports: []
})
export class SidebarComponent {
  activeMenu = signal<SidebarMenu>('collections');

  @Output() menuChange = new EventEmitter<SidebarMenu>();

  selectMenu(menu: SidebarMenu) {
    this.activeMenu.set(menu);
    this.menuChange.emit(menu);
  }
}
