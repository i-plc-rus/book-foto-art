import { IActionBarItem } from '../../../shared/components/editor-action-bar/action-bar-item';
import { CoverTemplate } from '../design-cover/cover-template';
import { GridGroup } from './grid-group';

export const GRID_GROUPS: GridGroup[] = [
  {
    title: 'Grid Style',
    items: [
      {
        id: 'vertical',
        name: 'Vertical',
        image: 'assets/images/grid/gallery_layout-vertical-DLlFPzGn.png',
      },
      {
        id: 'horizontal',
        name: 'Horizontal',
        image: 'assets/images/grid/gallery_layout-horizontal-BGGebzQ7.png',
      },
    ],
  },
  {
    title: 'Thumbnail Size',
    items: [
      {
        id: 'regular',
        name: 'Regular',
        image: 'assets/images/grid/thumbnail_size-regular-DsRmKk5_.png',
      },
      { id: 'large', name: 'Large', image: 'assets/images/grid/thumbnail_size-large-D--Q95q6.png' },
    ],
  },
  {
    title: 'Grid Spacing',
    items: [
      {
        id: 'spacing-regular',
        name: 'Regular',
        image: 'assets/images/grid/spacing-regular-bW27bkSv.png',
      },
      {
        id: 'spacing-large',
        name: 'Large',
        image: 'assets/images/grid/spacing-large-DNQiE_vy.png',
      },
    ],
  },
  {
    title: 'Navigation Style',
    items: [
      {
        id: 'icon-only',
        name: 'Icon Only',
        image: 'assets/images/grid/navigation_style-icon_only-Dq73LRIX.png',
      },
      {
        id: 'icon-text',
        name: 'Icon & Text',
        image: 'assets/images/grid/navigation_style-icon_text-CychTCGY.png',
      },
    ],
  },
];

export const ACTION_BAR_ITEMS: IActionBarItem[] = [
  { id: 'get-link', label: 'Get direct link' },
  { id: 'email-history', label: 'View email history' },
  { id: 'manage-presets', label: 'Manage presets' },
  { id: 'move-to', label: 'Move to' },
  { id: 'duplicate', label: 'Duplicate' },
  { id: 'divider', divider: true },
  { id: 'delete', label: 'Delete collection', disabled: true },
];
