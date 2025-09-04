import { inject } from '@angular/core';
import type { CanActivateFn } from '@angular/router';
import { Router } from '@angular/router';

import { AuthService } from '../core/service/auth.service';

export const redirectIfAuthenticatedGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  // если есть access_token → редиректим в /client-gallery
  if (auth.accessToken) {
    return router.parseUrl('/client-gallery');
  }

  return true;
};
