import { IActionBarItem } from '../../../shared/components/editor-action-bar/action-bar-item';
import { CoverTemplate } from '../design-cover/cover-template';

export const COLOR_TEMPLATES: CoverTemplate[] = [
  { id: 'Light', name: 'Light', image: 'assets/images/color/light.png' },
  { id: 'Gold', name: 'Gold', image: 'assets/images/color/gold.png' },
  { id: 'Rose', name: 'Rose', image: 'assets/images/color/rose.png' },
  { id: 'Terracotta', name: 'Terracotta', image: 'assets/images/color/terracotta.png' },
  { id: 'Sand', name: 'Sand', image: 'assets/images/color/sand.png' },
  { id: 'Olive', name: 'Olive', image: 'assets/images/color/olive.png' },
  { id: 'Agave', name: 'Agave', image: 'assets/images/color/agave.png' },
  { id: 'Sea', name: 'Sea', image: 'assets/images/color/sea.png' },
  { id: 'Dark', name: 'Dark', image: 'assets/images/color/dark.png' },
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
