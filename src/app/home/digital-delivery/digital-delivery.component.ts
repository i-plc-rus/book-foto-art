import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-digital-delivery',
  imports: [CommonModule],
  templateUrl: './digital-delivery.component.html',
  styleUrl: './digital-delivery.component.css',
})
export class DigitalDeliveryComponent {
  features = [
    'Быстро и безопасно',
    'С любого устройства',
    'Статистика скачивания',
    'Контроль над качеством и размерами',
  ];
}
