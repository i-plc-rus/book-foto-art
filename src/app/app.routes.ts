import { Routes } from '@angular/router';
import { LoginPageComponent } from './login-page/login-page.component';
import { HomeComponent } from './home/home.component';
import { RegisterPageComponent } from './register-page/register-page.component';
import { ProfileComponent } from './profile/profile.component';
import { AuthGuard } from './guards/auth.guard';
import {ClientGalleryComponent} from './pages/client-gallery-page/client-gallery/client-gallery.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginPageComponent },
  { path: 'register', component: RegisterPageComponent },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [AuthGuard]
  },
  { path: 'client-gallery',
    component: ClientGalleryComponent,
    canActivate: [AuthGuard]
  },
  {
    path: '',
    loadChildren: (): any => import('./module/main-layout/main.routes').then(m => m.MAIN),
    canActivate: [AuthGuard]
  }
];
