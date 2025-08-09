import {
  ChangeDetectionStrategy,
  Component,
  model,
  output, signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import {CollectionSortComponent} from '../collection-sort/collection-sort.component';
import {SortOption} from '../../models/collection-display.model';
import {NgIf} from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-collection-header',
  styleUrls: ['./collection-header.component.scss'],
  templateUrl: './collection-header.component.html',
  imports: [RouterLink, FormsModule, CollectionSortComponent, NgIf],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CollectionHeaderComponent {
  /** Флаг, включён ли роутер для «Просмотреть пресеты» */
  readonly sort = model.required<SortOption>();
  readonly sortChange = output<SortOption>();
  searchTerm = '';
  isMobileSearchActive = false;
  readonly newCollection = output<void>();
  readonly isPresetsDisabled = true;

  createNewCollection(): void {
    this.newCollection.emit();
  }

  onSortChange(option: SortOption) {
    this.sortChange.emit(option);
  }

  activateMobileSearch() {
    // тестируем ширину (опционально)
    if (window.innerWidth <= 768) {
      this.isMobileSearchActive = true;
      setTimeout(() => document.getElementById('search-bar')?.focus());
    } else {
      // на десктопе можно фокусировать без скрытия заголовка, если надо
      document.getElementById('search-bar')?.focus();
    }
    console.log('activateMobileSearch ->', this.isMobileSearchActive);
  }

  closeMobileSearch() {
    this.isMobileSearchActive = false;
    this.searchTerm = '';
    console.log('closeMobileSearch ->', this.isMobileSearchActive);
  }
}
