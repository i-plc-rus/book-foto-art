import { Component, computed, inject, Input, signal } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MobileMenuSheetComponent } from '../mobile-menu-sheet/mobile-menu-sheet.component';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-mobile-header',
  templateUrl: './mobile-header.component.html',
  styleUrl: './mobile-header.component.css',
  imports: [],
})
export class MobileHeaderComponent {
  @Input() titleSignal = signal<any | null>(null);

  title = computed(() => this.titleSignal()?.name ?? '');
  private bottomSheet = inject(MatBottomSheet);
  private router = inject(Router);

  goBack() {
    this.router.navigate(['/client-gallery']);
  }

  onEdit() {
    console.log('Edit clicked');
  }

  openMenu() {
    this.bottomSheet.open(MobileMenuSheetComponent);
  }
}
