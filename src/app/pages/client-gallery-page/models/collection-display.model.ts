export type DisplayView = 'grid' | 'list';

export type SortOption =
  | 'created-new'
  | 'created-old'
  | 'event-new'
  | 'event-old'
  | 'name-asc'
  | 'name-desc';

interface SortOptionItem {
  label: string;
  value: SortOption;
}

export const SORT_OPTIONS: SortOptionItem[] = [
  { label: 'Создано: Новые → Старые', value: 'created-new' },
  { label: 'Создано: Старые → Новые', value: 'created-old' },
  { label: 'Название: A–Я', value: 'name-asc' },
  { label: 'Название: Я–A', value: 'name-desc' },
];
