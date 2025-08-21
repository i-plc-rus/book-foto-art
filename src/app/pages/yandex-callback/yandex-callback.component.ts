import type { OnInit } from '@angular/core';
import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Toast } from 'primeng/toast';
import type { OperatorFunction } from 'rxjs';
import { catchError, from, tap } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';

import { AuthService } from '../../core/service/auth.service';

@Component({
  selector: 'app-yandex-callback',
  imports: [Toast],
  templateUrl: './yandex-callback.component.html',
  styleUrl: './yandex-callback.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class YandexCallbackComponent implements OnInit {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly messageService = inject(MessageService);

  ngOnInit(): void {
    this.observeRouter();
  }

  /**
   * Получить параметры из роутера
   */
  observeRouter(): void {
    this.activatedRoute.queryParamMap
      .pipe(
        take(1),
        map((qp) => ({
          code: qp.get('code') ?? '',
          state: qp.get('state') ?? '',
        })),
        this.tapParamsGuard(),
        switchMap(({ code, state }) =>
          this.authService.yandexCallback(code, state).pipe(
            switchMap(() => from(this.router.navigate(['/client-gallery']))),
            catchError((err) => {
              console.error('Yandex callback error', err);
              this.messageService.add({
                severity: 'error',
                summary: 'Ошибка входа через Яндекс',
                detail: 'Не удалось завершить вход. Попробуйте снова.',
                life: 4000,
              });
              return from(this.router.navigate(['/login']));
            }),
          ),
        ),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }

  tapParamsGuard(): OperatorFunction<
    { code: string; state: string },
    { code: string; state: string }
  > {
    return tap(({ code, state }) => {
      if (!code || !state) {
        throw new Error('Missing OAuth params: code/state');
      }
    });
  }
}
