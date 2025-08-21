import type { IActionBarItem } from '../../../shared/components/editor-action-bar/action-bar-item';
import type { GridGroup } from './grid-group';

export const GRID_GROUPS: GridGroup[] = [
  {
    title: 'Стиль сетки',
    items: [
      {
        id: 'vertical',
        name: 'Вертикальная',
        image: 'assets/images/grid/gallery_layout-vertical-DLlFPzGn.png',
      },
      {
        id: 'horizontal',
        name: 'Горизонтальная',
        image: 'assets/images/grid/gallery_layout-horizontal-BGGebzQ7.png',
      },
    ],
  },
  {
    title: 'Размер миниатюр',
    items: [
      {
        id: 'regular',
        name: 'Обычный',
        image: 'assets/images/grid/thumbnail_size-regular-DsRmKk5_.png',
      },
      {
        id: 'large',
        name: 'Крупный',
        image: 'assets/images/grid/thumbnail_size-large-D--Q95q6.png',
      },
    ],
  },
  {
    title: 'Отступы сетки',
    items: [
      {
        id: 'spacing-regular',
        name: 'Обычные',
        image: 'assets/images/grid/spacing-regular-bW27bkSv.png',
      },
      {
        id: 'spacing-large',
        name: 'Большие',
        image: 'assets/images/grid/spacing-large-DNQiE_vy.png',
      },
    ],
  },
  {
    title: 'Стиль навигации',
    items: [
      {
        id: 'icon-only',
        name: 'Только иконки',
        image: 'assets/images/grid/navigation_style-icon_only-Dq73LRIX.png',
      },
      {
        id: 'icon-text',
        name: 'Иконки и текст',
        image: 'assets/images/grid/navigation_style-icon_text-CychTCGY.png',
      },
    ],
  },
];

export const ACTION_BAR_ITEMS: IActionBarItem[] = [
  { id: 'get-link', label: 'Получить прямую ссылку' },
  { id: 'email-history', label: 'История отправки по email' },
  { id: 'manage-presets', label: 'Управление пресетами' },
  { id: 'move-to', label: 'Переместить' },
  { id: 'duplicate', label: 'Дублировать' },
  { id: 'divider', divider: true },
  { id: 'delete', label: 'Удалить коллекцию', disabled: true },
];
