import { Component, output } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-collection-header',
  styleUrls: ['./collection-header.component.scss'],
  imports: [RouterLink],
  templateUrl: './collection-header.component.html',
  standalone: true,
})
export class CollectionHeaderComponent {
  /** Флаг, включён ли роутер для «Просмотреть пресеты» */

  readonly newCollection = output<void>();
  readonly isPresetsDisabled = true;

  createNewCollection(): void {
    this.newCollection.emit();
  }
}
