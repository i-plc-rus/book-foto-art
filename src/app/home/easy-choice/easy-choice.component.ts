import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-easy-choice',
  imports: [CommonModule],
  templateUrl: './easy-choice.component.html',
  styleUrl: './easy-choice.component.css',
})
export class EasyChoiceComponent {
  features = [
    'Избранное в печать',
    'Скачать избранное',
    'Поделиться избранным',
    'Утверждение обложки галереи',
  ];
}
