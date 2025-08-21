import { IActionBarItem } from '../../../shared/components/editor-action-bar/action-bar-item';
import { CoverTemplate } from './cover-template';

export const COVER_TEMPLATES: CoverTemplate[] = [
  { id: 'frame', name: 'Рамка', image: 'assets/images/covers/divider.png' },
  { id: 'stripe', name: 'Полоса', image: 'assets/images/covers/divider.png' },
  { id: 'divider', name: 'Разделитель', image: 'assets/images/covers/divider.png' },
  { id: 'journal', name: 'Журнал', image: 'assets/images/covers/divider.png' },
  { id: 'stamp', name: 'Штамп', image: 'assets/images/covers/divider.png' },
  { id: 'outline', name: 'Контур', image: 'assets/images/covers/divider.png' },
  { id: 'classic', name: 'Классика', image: 'assets/images/covers/divider.png' },
  { id: 'extra1', name: 'Доп. вариант 1', image: 'assets/images/covers/divider.png' },
  { id: 'extra2', name: 'Доп. вариант 2', image: 'assets/images/covers/divider.png' },
  { id: 'extra3', name: 'Доп. вариант 3', image: 'assets/images/covers/divider.png' },
  { id: 'extra4', name: 'Доп. вариант 4', image: 'assets/images/covers/divider.png' },
  { id: 'extra5', name: 'Доп. вариант 5', image: 'assets/images/covers/divider.png' },
  { id: 'extra6', name: 'Доп. вариант 6', image: 'assets/images/covers/divider.png' },
  { id: 'extra7', name: 'Доп. вариант 7', image: 'assets/images/covers/divider.png' },
  { id: 'extra8', name: 'Доп. вариант 8', image: 'assets/images/covers/divider.png' },
  { id: 'none', name: 'Без обложки', image: 'assets/images/covers/none.png' },
];

export const ACTION_BAR_ITEMS: IActionBarItem[] = [
  { id: 'get-link', label: 'Получить прямую ссылку' },
  { id: 'email-history', label: 'История отправки писем' },
  { id: 'manage-presets', label: 'Управление пресетами' },
  { id: 'move-to', label: 'Переместить' },
  { id: 'duplicate', label: 'Дублировать' },
  { id: 'divider', divider: true },
  { id: 'delete', label: 'Удалить коллекцию', disabled: true },
];
