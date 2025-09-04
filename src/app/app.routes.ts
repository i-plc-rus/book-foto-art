import type { Routes } from '@angular/router';

import { AuthGuard } from './guards/auth.guard';
import { redirectIfAuthenticatedGuard } from './guards/redirect-if-authenticated.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: (): any => import('./home/home.component').then((m) => m.HomeComponent),
    canActivate: [redirectIfAuthenticatedGuard],
  },
  {
    path: 'login',
    loadComponent: (): any =>
      import('./module/auth/login-page/login-page.component').then((m) => m.LoginPageComponent),
    canActivate: [redirectIfAuthenticatedGuard],
  },
  {
    path: 'register',
    loadComponent: (): any =>
      import('./module/auth/register-page/register-page.component').then(
        (m) => m.RegisterPageComponent,
      ),
    canActivate: [redirectIfAuthenticatedGuard],
  },
  {
    path: 'reset-password',
    loadComponent: (): any =>
      import('./module/auth/forgot-password/forgot-password.component').then(
        (m) => m.ForgotPasswordComponent,
      ),
  },
  {
    path: 'profile',
    loadComponent: (): any => import('./profile/profile.component').then((m) => m.ProfileComponent),
    canActivate: [AuthGuard],
  },
  {
    path: 'client-gallery',
    loadComponent: (): any =>
      import('./pages/client-gallery-page/client-gallery/client-gallery.component').then(
        (m) => m.ClientGalleryComponent,
      ),
    canActivate: [AuthGuard],
  },
  {
    path: '',
    loadChildren: (): any => import('./module/main-layout/main.routes').then((m) => m.MAIN),
    canActivate: [],
  },
  {
    path: 's/:token',
    loadComponent: () =>
      import('./pages/collection-site/collection-site/collection-site.component').then(
        (c) => c.CollectionSiteComponent,
      ),
  },
  {
    path: 'verification',
    loadComponent: () =>
      import('./pages/yandex-callback/yandex-callback.component').then(
        (m) => m.YandexCallbackComponent,
      ),
  },
  {
    path: 'subscription/result/:paymentId',
    loadComponent: () =>
      import('./pages/subscription-result/subscription-result.component').then(
        (m) => m.SubscriptionResultComponent,
      ),
    canActivate: [AuthGuard],
  },
];
