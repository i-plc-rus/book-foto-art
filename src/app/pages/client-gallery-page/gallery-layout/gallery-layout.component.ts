import {Component, HostListener, OnInit, signal} from '@angular/core';
import { CommonModule } from '@angular/common';
import {MobileHeaderComponent} from '../../sidebar/mobile-header/mobile-header.component';
import {SidebarComponent} from '../../sidebar/sidebar.component';

@Component({
  standalone: true,
  selector: 'app-gallery-layout',
  templateUrl: './gallery-layout.component.html',
  styleUrls: ['./gallery-layout.component.css'],
  imports: [
    CommonModule,
    SidebarComponent,
    MobileHeaderComponent
  ]
})
export class GalleryLayoutComponent implements OnInit{
  isMobileView = signal(false);

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.checkViewport();
  }

  ngOnInit() {
    this.checkViewport();
  }

  private checkViewport() {
    this.isMobileView.set(window.innerWidth < 768);
  }

  onTabChange(tab: string) {
    console.log('Selected tab:', tab);
    // Здесь можно добавить логику обработки выбора таба
  }
}
