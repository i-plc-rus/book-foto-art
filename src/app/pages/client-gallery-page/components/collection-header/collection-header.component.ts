import { ChangeDetectionStrategy, Component, model, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CollectionSortComponent } from '../collection-sort/collection-sort.component';
import { SortOption } from '../../models/collection-display.model';
import { NgIf } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-collection-header',
  styleUrls: ['./collection-header.component.scss'],
  templateUrl: './collection-header.component.html',
  imports: [RouterLink, FormsModule, CollectionSortComponent, NgIf],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CollectionHeaderComponent {
  readonly sort = model.required<SortOption>();
  readonly searchTerm = model.required<string>();
  readonly sortChange = output<SortOption>();
  readonly newCollection = output<void>();

  readonly isPresetsDisabled = true;
  readonly isMobileSearchActive = signal(false);

  readonly menuOpen = signal(false);

  createNewCollection(): void {
    this.newCollection.emit();
  }

  onSortChange(option: SortOption) {
    this.sortChange.emit(option);
  }

  toggleMenu() {
    this.menuOpen.set(!this.menuOpen());
  }

  onNewCollection() {
    this.menuOpen.set(false);
    this.newCollection.emit();
  }

  onNewFolder() {
    this.menuOpen.set(false);
    alert('New Folder clicked');
  }

  activateMobileSearch() {
    if (window.innerWidth <= 768) {
      this.isMobileSearchActive.set(true);
      setTimeout(() => document.getElementById('search-bar')?.focus());
    } else {
      document.getElementById('search-bar')?.focus();
    }
  }

  closeMobileSearch() {
    this.isMobileSearchActive.set(false);
    this.searchTerm.set('');
  }

  onInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchTerm.set(input.value);
  }
}
