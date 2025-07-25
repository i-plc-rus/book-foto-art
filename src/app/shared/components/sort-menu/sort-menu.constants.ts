import {ISortOption} from './interface/sort-option';

export const SORT_OPTION: ISortOption[] = [
  { value: 'uploaded_new', label: 'Uploaded: New → Old' },
  { value: 'uploaded_old', label: 'Uploaded: Old → New' },
  { value: 'date_new', label: 'Date Taken: New → Old' },
  { value: 'date_old', label: 'Date Taken: Old → New' },
  { value: 'az', label: 'Name: A-Z' },
  { value: 'za', label: 'Name: Z-A' },
  { value: 'random', label: 'Random' }
];
