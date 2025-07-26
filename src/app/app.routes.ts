import { Routes } from '@angular/router';
import { LoginPageComponent } from './login-page/login-page.component';
import { HomeComponent } from './home/home.component';
import { RegisterPageComponent } from './register-page/register-page.component';
import { ProfileComponent } from './profile/profile.component';
import { AuthGuard } from './guards/auth.guard';
import { GalleryUploadComponent } from './gallery-upload/gallery-upload.component';

export const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'login', component: LoginPageComponent },
  { path: 'register', component: RegisterPageComponent },

  {
    path: 'client-gallery',
    loadComponent: () =>
      import(
        './pages/client-gallery-page/client-gallery/client-gallery.component'
      ).then((m) => m.ClientGalleryComponent),
    canActivate: [AuthGuard],
  },

  {
    path: 'upload',
    component: GalleryUploadComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [AuthGuard], // 👈 защищаем маршрут
  },
  //ng generate guard guards/auth{ path: '', redirectTo: '/profile', pathMatch: 'full' },
];
