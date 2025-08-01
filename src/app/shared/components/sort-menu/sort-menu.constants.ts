import {ISortOption} from './interface/sort-option';

export const SORT_OPTION: ISortOption[] = [
  { value: 'uploaded_new', label: 'Uploaded: New → Old' },
  { value: 'uploaded_old', label: 'Uploaded: Old → New' },
  { value: 'name_az', label: 'Name: A-Z' },
  { value: 'name_za', label: 'Name: Z-A' },
  { value: 'random', label: 'Random' }
];
