import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-change-cover',
  templateUrl: './change-cover.component.html',
  styleUrl: './change-cover.component.css',
  imports: [],
})
export class ChangeCoverComponent {
  @Output() closeCover = new EventEmitter<void>();
  @Output() selectFromCollection = new EventEmitter<void>();
  @Output() browseFiles = new EventEmitter<void>();
}
