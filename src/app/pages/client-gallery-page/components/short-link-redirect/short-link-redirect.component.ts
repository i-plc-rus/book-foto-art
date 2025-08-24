import type { OnInit } from '@angular/core';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { ProgressSpinner } from 'primeng/progressspinner';
import { catchError, EMPTY } from 'rxjs';
import { take } from 'rxjs/operators';

import { CollectionApiService } from '../../../../api/collection-api.service';
import type { IShortLinkInfo } from '../../../../interfaces/collection.interface';

@Component({
  selector: 'app-short-link-redirect',
  imports: [ProgressSpinner],
  templateUrl: './short-link-redirect.component.html',
  styleUrl: './short-link-redirect.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShortLinkRedirectComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly api = inject(CollectionApiService);
  private readonly destroyRef = inject(DestroyRef);

  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  ngOnInit(): void {
    const token = this.route.snapshot.paramMap.get('token');
    if (!token) {
      this.go404('Токен не найден');
      return;
    }

    this.api
      .getShortLinkInfo(token)
      .pipe(
        take(1),
        takeUntilDestroyed(this.destroyRef),
        catchError((err) => {
          console.error(err);
          this.go404('Ссылка недействительна');
          return EMPTY;
        }),
      )
      .subscribe((info: IShortLinkInfo) => {
        // подстрой название поля, если другое
        const fullUrl =
          (info as any).url ||
          (info as any).full_url ||
          (info as any).original_url ||
          (info as any).link;

        if (!fullUrl || typeof fullUrl !== 'string') {
          this.go404('Полная ссылка не найдена');
          return;
        }

        // если тот же домен — мягкий SPA-переход
        if (this.isSameOrigin(fullUrl)) {
          const u = new URL(fullUrl, window.location.origin);
          this.router.navigateByUrl(u.pathname + u.search + u.hash);
        } else {
          window.location.href = fullUrl; // внешний домен
        }
      });
  }

  private isSameOrigin(url: string): boolean {
    try {
      return new URL(url, window.location.origin).origin === window.location.origin;
    } catch {
      return false;
    }
  }

  private go404(message: string): void {
    this.error.set(message);
    this.loading.set(false);
    this.router.navigateByUrl('/not-found');
  }
}
