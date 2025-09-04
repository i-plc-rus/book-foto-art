import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Toast } from 'primeng/toast';

import { BillingApiService } from '../../api/billing-api.service';
import type { Plan } from '../../interfaces/billing.interface';

@Component({
  selector: 'app-tariffs',
  imports: [DecimalPipe, FormsModule, Toast],
  templateUrl: './tariffs.component.html',
  styleUrl: './tariffs.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TariffsComponent {
  private billingApiService = inject(BillingApiService);
  private messageService = inject(MessageService);

  // выбор тарифа
  plan = signal<Plan>('month');

  // промокод
  promoCode = signal('');
  promoStatus = signal<'idle' | 'checking' | 'valid' | 'invalid'>('idle');
  promoMessage = signal<string | null>(null);
  discount = signal<number>(0);

  creatingPayment = signal(false);

  baseMonth = 2780;
  baseYear = 17760;

  price = computed(() => {
    const base = this.plan() === 'month' ? this.baseMonth : this.baseYear;
    const d = this.discount();
    return d > 0 ? Math.max(0, Math.round(base * (1 - d / 100))) : base;
  });

  checkPromo(): void {
    const code = this.promoCode().trim();
    if (!code) {
      this.promoStatus.set('invalid');
      this.promoMessage.set('Введите промокод');
      this.discount.set(0);
      return;
    }
    this.promoStatus.set('checking');
    this.promoMessage.set(null);
    this.discount.set(0);

    this.billingApiService.checkPromo(code).subscribe({
      next: (r) => {
        if (r.valid) {
          this.promoStatus.set('valid');
          this.discount.set(r.discount ?? 0);
          this.promoMessage.set(r.message ?? 'Промокод применён');
        } else {
          this.promoStatus.set('invalid');
          this.promoMessage.set(r.message ?? 'Неверный или недействительный промокод');
          this.discount.set(0);
        }
      },
      error: () => {
        this.promoStatus.set('invalid');
        this.promoMessage.set('Не удалось проверить промокод');
        this.discount.set(0);
      },
    });
  }

  proceedToPayment(): void {
    this.creatingPayment.set(true);
    this.billingApiService.extendSubscription(this.plan()).subscribe({
      next: ({ confirmation_url }) => {
        window.location.href = confirmation_url;
      },
      error: () => {
        this.creatingPayment.set(false);
        this.messageService.add({
          severity: 'error',
          summary: 'Ошибка',
          detail: 'Не удалось создать платёж',
          life: 2500,
        });
      },
    });
  }
}
