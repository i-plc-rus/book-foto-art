import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import type { ApplicationConfig } from '@angular/core';
import { importProvidersFrom, LOCALE_ID, provideZoneChangeDetection } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import Aura from '@primeng/themes/aura';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { providePrimeNG } from 'primeng/config';

import { routes } from './app.routes';
import { AuthInterceptor } from './core/interceptor/auth.interceptor';
import { SidebarService } from './core/service/sidebar.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimations(),
    providePrimeNG({
      theme: {
        preset: Aura,
        options: {
          darkModeSelector: '.dark',
        },
      },
    }),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    SidebarService,
    importProvidersFrom(
      NgxDaterangepickerMd.forRoot({
        separator: ' – ',
        format: 'DD.MM.YYYY',
      }),
    ),
    { provide: LOCALE_ID, useValue: 'ru' },
  ],
};
