import { Routes } from '@angular/router';
import { LoginPageComponent } from './login-page/login-page.component';
import { HomeComponent } from './home/home.component';
import { RegisterPageComponent } from './register-page/register-page.component';

export const routes: Routes = [
     {path: '', component: HomeComponent},
     { path: 'login', component: LoginPageComponent },
     { path: 'register', component: RegisterPageComponent },
];
