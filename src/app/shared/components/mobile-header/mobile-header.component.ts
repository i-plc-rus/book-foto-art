import { Component, computed, inject, Input, signal } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Toast } from 'primeng/toast';

import { MobileMenuSheetComponent } from '../mobile-menu-sheet/mobile-menu-sheet.component';

@Component({
  standalone: true,
  selector: 'app-mobile-header',
  templateUrl: './mobile-header.component.html',
  styleUrl: './mobile-header.component.css',
  imports: [Toast],
})
export class MobileHeaderComponent {
  @Input() titleSignal = signal<any | null>(null);
  @Input() isPublished: boolean = false;
  @Input() publicLink: string | null = null;

  private readonly messageService = inject(MessageService);

  title = computed(() => this.titleSignal()?.name ?? '');
  private bottomSheet = inject(MatBottomSheet);
  private router = inject(Router);

  async goBack(): Promise<void> {
    await this.router.navigate(['/client-gallery']);
  }

  onEdit(): void {
    console.log('Edit clicked');
  }

  openMenu(): void {
    this.bottomSheet.open(MobileMenuSheetComponent);
  }

  async copyPublicLink(): Promise<void> {
    if (!this.publicLink) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Нет ссылки',
        detail: 'Коллекция не опубликована',
        life: 2000,
      });
      return;
    }

    try {
      await navigator.clipboard.writeText(this.publicLink);

      this.messageService.add({
        severity: 'success',
        summary: 'Скопировано',
        detail: this.publicLink,
        life: 1500,
      });
    } catch (e) {
      console.error('Clipboard error', e);
      this.messageService.add({
        severity: 'error',
        summary: 'Ошибка',
        detail: 'Не удалось скопировать ссылку',
        life: 2500,
      });
    }
  }
}
