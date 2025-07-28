import {
  ChangeDetectionStrategy,
  Component,
  model,
  output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-collection-header',
  styleUrls: ['./collection-header.component.scss'],
  imports: [RouterLink, FormsModule],
  templateUrl: './collection-header.component.html',
  standalone: true,
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
