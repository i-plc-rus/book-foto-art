import { CommonModule, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

interface ISavedGallery {
  name: string;
  userName: string;
  createDate: string;
  images: {
    link: string;
    isFavorite: boolean;
  }[];
}

export const mockGalleries: ISavedGallery = {
  name: 'Мужская фотосессия #1',
  userName: 'Nursultan',
  createDate: '2025-07-10',
  images: [
    {
      link: 'assets/mockImages/8dfa455df6206f75c8bee021fdeca0b9.jpg',
      isFavorite: false,
    },
    {
      link: 'assets/mockImages/7ca83dc4f5e31627917e87ac7c6ba77d.jpg',
      isFavorite: true,
    },
    {
      link: 'assets/mockImages/42a4824f7f9b0ae93d9a6bd27f64927.jpg',
      isFavorite: false,
    },
    {
      link: 'assets/mockImages/1702895570_bogatyr-club-p-koshechka-iz-toma-i-dzherri-foni-instagram-4.png',
      isFavorite: true,
    },
    {
      link: 'assets/mockImages/c63614620afcdef67c6a6e32d1d557a9.jpg',
      isFavorite: false,
    },
    {
      link: 'assets/mockImages/ead3b558586cc51653230d9eaf58f503.jpg',
      isFavorite: true,
    },
    {
      link: 'assets/mockImages/ecfeae202fa63b267b9ab14f051828b6.jpg',
      isFavorite: false,
    },
    {
      link: 'assets/mockImages/f4319ba238bdc7da00c56adbb45461dc.jpg',
      isFavorite: false,
    },
  ],
};

@Component({
  selector: 'app-collection-site',
  templateUrl: './collection-site.component.html',
  styleUrls: ['./collection-site.component.scss'],
  imports: [DatePipe, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class CollectionSiteComponent {
  readonly gallery = signal<ISavedGallery>(mockGalleries);
}
