import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import {SidebarService} from '../service/sidebar.service';

export const sidebarResolver: ResolveFn<void> = (route) => {
  const sidebarService = inject(SidebarService);
  const title = route.data['title'] || 'Моя галерея';

  sidebarService.setTitle(title);
  sidebarService.setDate(new Date());

  return;
};
