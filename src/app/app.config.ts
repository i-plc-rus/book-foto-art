import { ApplicationConfig, importProvidersFrom, LOCALE_ID, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { HTTP_INTERCEPTORS, provideHttpClient , withInterceptorsFromDi} from '@angular/common/http';
import { AuthInterceptor } from './auth.interceptor';
import {SidebarService} from './core/service/sidebar.service';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    SidebarService,
    importProvidersFrom(
      NgxDaterangepickerMd.forRoot({
        separator: ' – ',
        format: 'DD.MM.YYYY',
      })
    ),
    { provide: LOCALE_ID, useValue: 'ru' },
  ]
};
