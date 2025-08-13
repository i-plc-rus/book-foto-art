import { Routes } from '@angular/router';
import { AuthGuard } from '../../guards/auth.guard';
import { MainLayoutComponent } from './main-layout.component';

export const MAIN: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'upload',
        loadComponent: (): any =>
          import('./../../gallery-upload/gallery-upload.component').then(
            (m) => m.GalleryUploadComponent,
          ),
        data: { title: 'Медиа файлы' },
      },
      {
        path: 'design',
        loadChildren: (): any =>
          import('./../design-component/design.routes').then((m) => m.DESIGN_ROUTES),
        data: { title: 'Медиа файлы' },
      },
    ],
  },
];
