import type { Signal } from '@angular/core';

export type ImagePreviewData = {
  images: Signal<{ link: string; isFavorite: boolean }[]>;
  currentIndex: number;
};

export type ImageSliderData = {
  images: Signal<{ link: string; isFavorite: boolean }[]>;
  currentIndex: Signal<number>;
};

export type ImagePreviewEvent =
  | { type: ImageEventType.favorite; index: number }
  | { type: ImageEventType.delete; index: number };

export enum ImageEventType {
  favorite = 'favorite',
  delete = 'delete',
}
