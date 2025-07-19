import { Routes } from '@angular/router';
import { LoginPageComponent } from './login-page/login-page.component';
import { HomeComponent } from './home/home.component';
import { RegisterPageComponent } from './register-page/register-page.component';
import { ProfileComponent } from './profile/profile.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
     {path: '', component: HomeComponent},
     { path: 'login', component: LoginPageComponent },
     { path: 'register', component: RegisterPageComponent },
     {
     path: 'profile',
     component: ProfileComponent,
     canActivate: [AuthGuard]  // 👈 защищаем маршрут
     },
     //ng generate guard guards/auth{ path: '', redirectTo: '/profile', pathMatch: 'full' },
];
