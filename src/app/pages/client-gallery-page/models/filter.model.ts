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
