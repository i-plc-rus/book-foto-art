import { Signal } from '@angular/core';

export type ImagePreviewData = {
  images: Signal<
    {
      link: string;
      isFavorite: boolean;
    }[]
  >;
  currentIndex: number;
};

export type ImageSliderData = {
  images: Signal<
    {
      link: string;
      isFavorite: boolean;
    }[]
  >;
  currentIndex: Signal<number>;
};
