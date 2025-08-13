import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../core/service/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  canActivate(): boolean {
    const token = this.authService.accessToken;

    if (token) {
      return true;
    } else {
      this.router.navigate(['/login']).catch();
      return false;
    }
  }
}
