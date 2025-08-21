import { ISavedGallery } from '../../../gallery-upload/interface/upload-file';

export type DisplayView = 'grid' | 'list';

export enum SortOption {
  CreatedNew = 'created-new',
  CreatedOld = 'created-old',
  EventNew = 'event-new',
  EventOld = 'event-old',
  NameAsc = 'name-asc',
  NameDesc = 'name-desc',
}

export interface SortOptionItem {
  label: string;
  value: SortOption;
}

export const SORT_OPTIONS: SortOptionItem[] = [
  { label: 'Создано: Новые → Старые', value: SortOption.CreatedNew },
  { label: 'Создано: Старые → Новые', value: SortOption.CreatedOld },
  { label: 'Название: A–Я', value: SortOption.NameAsc },
  { label: 'Название: Я–A', value: SortOption.NameDesc },
];

export enum CollectionActionType {
  Publish = 'опубликовать',
  Delete = 'удалить',
}

export interface CollectionAction {
  key: CollectionActionType;
  label: string;
}

export interface CollectionActionPayload {
  actionKey: CollectionActionType;
  item: ISavedGallery;
}

export interface ShareCollectionData {
  url: string;
}
