import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { CommonModule } from '@angular/common';

type Collection = {
  link: string;
  isFavorite: boolean;
};

@Component({
  selector: 'app-gallery-image-card',
  imports: [CommonModule],
  templateUrl: './gallery-image-card.component.html',
  styleUrls: ['./gallery-image-card.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GalleryImageCardComponent {
  readonly imageUrl = input.required<Collection>();
  readonly makeFavorite = output<void>();

  downloadImage(): void {
    const link = document.createElement('a');
    link.href = this.imageUrl().link;
    link.download = this.extractFileName(this.imageUrl().link);
    link.click();
  }

  private extractFileName(url: string): string {
    return url.split('/').pop() || 'image.jpg';
  }

  handleFavorite(): void {
    this.makeFavorite.emit();
  }
}
