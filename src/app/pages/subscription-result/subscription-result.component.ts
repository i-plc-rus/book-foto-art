import type { OnInit } from '@angular/core';
import { computed } from '@angular/core';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs';

import { SubscriptionApiService } from '../../api/subscription-api.service';
import type { PaymentResult } from '../../interfaces/payment.interface';

@Component({
  selector: 'app-subscription-result',
  imports: [],
  templateUrl: './subscription-result.component.html',
  styleUrl: './subscription-result.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SubscriptionResultComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly api = inject(SubscriptionApiService);

  readonly isLoading = signal(true);
  readonly payment = signal<PaymentResult | null>(null);
  readonly error = signal<string | null>(null);

  // Вспомогательные вычисляемые сигналы
  private readonly status = computed(() => this.payment()?.status ?? null);

  readonly isSuccess = computed(() => this.status() === 'succeeded');
  readonly isCanceled = computed(() => this.status() === 'canceled');
  readonly isFailed = computed(() => this.status() === 'failed');
  readonly isPending = computed(() => this.status() === 'pending');

  // Что показывать в шаблоне
  readonly showLoading = computed(() => this.isLoading());
  readonly showError = computed(() => !this.isLoading() && !!this.error());
  readonly showSuccess = computed(() => !this.isLoading() && this.isSuccess());
  readonly showWarn = computed(() => !this.isLoading() && (this.isCanceled() || this.isFailed()));
  readonly showPending = computed(() => !this.isLoading() && this.isPending());

  ngOnInit(): void {
    const paramId = this.route.snapshot.paramMap.get('paymentId');
    const queryId = this.route.snapshot.queryParamMap.get('payment_id');
    const id = paramId || queryId;

    if (!id) {
      this.error.set('Не найден идентификатор платежа');
      this.isLoading.set(false);
      return;
    }

    this.api
      .getPaymentResult(id)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (res) => this.payment.set(res),
        error: () => this.error.set('Не удалось получить результат платежа'),
      });
  }

  goToGalleries(): void {
    this.router.navigate(['/client-gallery']).catch();
  }
}
