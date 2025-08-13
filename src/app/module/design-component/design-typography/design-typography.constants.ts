import { IActionBarItem } from '../../../shared/components/editor-action-bar/action-bar-item';
import { CoverTemplate } from '../design-cover/cover-template';

export const TYPOGRAPHY_TEMPLATES: CoverTemplate[] = [
  { id: 'Sans', name: 'Sans', title: 'A neutral font', image: 'assets/images/typography/sans.png' },
  {
    id: 'Serif',
    name: 'Serif',
    title: 'A classic font',
    image: 'assets/images/typography/serif.png',
  },
  {
    id: 'Modern',
    name: 'Modern',
    title: 'A sophisticated font',
    image: 'assets/images/typography/modern.png',
  },
  {
    id: 'Timeless',
    name: 'Timeless',
    title: 'A light and airy font',
    image: 'assets/images/typography/timless.png',
  },
  { id: 'Bold', name: 'Bold', title: 'A punchy font', image: 'assets/images/typography/bold.png' },
  {
    id: 'Subtle',
    name: 'Subtle',
    title: 'A minimal font',
    image: 'assets/images/typography/subtle.png',
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
