import {Component, inject} from '@angular/core';
import {Router, RouterLink, RouterLinkActive} from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrl: './tabs.component.css',
  imports: [
    RouterLink,
    RouterLinkActive
  ]
})
export class TabsComponent {
  hoveredTab: string | null = null;

  private router = inject(Router)

  tabs = [
    {
      icon: 'assets/icons/images.svg',
      tooltip: 'Картинки',
      link: '/upload'
    },
    {
      icon: 'assets/icons/icon-design.svg',
      tooltip: 'Дизайн',
      link: '/design/cover'
    },
    {
      icon: 'assets/icons/setting.svg',
      tooltip: 'Настройка',
      link: '/gallery/settings'
    },
    {
      icon: 'assets/icons/wifi.svg',
      tooltip: 'Активные',
      link: '/gallery/active'
    }
  ];

  isActive(link: string): boolean {
    return this.router.isActive(link, {
      paths: 'subset',
      queryParams: 'subset',
      fragment: 'ignored',
      matrixParams: 'ignored'
    });
  }
}
