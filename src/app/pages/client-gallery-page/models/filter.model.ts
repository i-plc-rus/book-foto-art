export type FilterType = 'select' | 'date';
export type SelectionType = 'single' | 'multiple';

export interface FilterConfig {
  label: string;
  type: FilterType;
  selection?: SelectionType;
  options?: string[];
}

export const STATUS: FilterConfig = {
  label: 'Статус',
  type: 'select',
  selection: 'multiple',
  options: ['Опубликовано', 'Скрыто', 'Черновик'],
};

export const EVENT_DATE: FilterConfig = {
  label: 'Дата события',
  type: 'date',
};

export const CATEGORY_TAG: FilterConfig = {
  label: 'Категория',
  type: 'select',
  selection: 'multiple',
  options: [],
};

export const EXPIRY_DATE: FilterConfig = {
  label: 'Дата истечения',
  type: 'date',
};

export const STARRED: FilterConfig = {
  label: 'Избранное',
  type: 'select',
  selection: 'single',
  options: ['Да', 'Нет'],
};
