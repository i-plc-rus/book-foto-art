import {
  ChangeDetectionStrategy,
  Component,
  model,
  output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-collection-header',
  styleUrls: ['./collection-header.component.scss'],
  templateUrl: './collection-header.component.html',
  imports: [RouterLink, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CollectionHeaderComponent {
  readonly searchTerm = model.required<string>();
  /** Флаг, включён ли роутер для «Просмотреть пресеты» */

  readonly newCollection = output<void>();
  readonly isPresetsDisabled = true;

  createNewCollection(): void {
    this.newCollection.emit();
  }
}
