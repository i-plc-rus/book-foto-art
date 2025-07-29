import {IActionBarItem} from '../../../shared/components/editor-action-bar/action-bar-item';
import {CoverTemplate} from './cover-template';


export const COVER_TEMPLATES: CoverTemplate[] = [
  { id: 'frame', name: 'Frame', image: 'assets/images/covers/divider.png' },
  { id: 'stripe', name: 'Stripe', image: 'assets/images/covers/divider.png' },
  { id: 'divider', name: 'Divider', image: 'assets/images/covers/divider.png' },
  { id: 'journal', name: 'Journal', image: 'assets/images/covers/divider.png' },
  { id: 'stamp', name: 'Stamp', image: 'assets/images/covers/divider.png' },
  { id: 'outline', name: 'Outline', image: 'assets/images/covers/divider.png' },
  { id: 'classic', name: 'Classic', image: 'assets/images/covers/divider.png' },
  { id: 'extra1', name: 'Extra 1', image: 'assets/images/covers/divider.png' },
  { id: 'extra2', name: 'Extra 2', image: 'assets/images/covers/divider.png' },
  { id: 'extra3', name: 'Extra 3', image: 'assets/images/covers/divider.png' },
  { id: 'extra4', name: 'Extra 4', image: 'assets/images/covers/divider.png' },
  { id: 'extra5', name: 'Extra 5', image: 'assets/images/covers/divider.png' },
  { id: 'extra6', name: 'Extra 6', image: 'assets/images/covers/divider.png' },
  { id: 'extra7', name: 'Extra 7', image: 'assets/images/covers/divider.png' },
  { id: 'extra8', name: 'Extra 8', image: 'assets/images/covers/divider.png' },
  { id: 'none', name: 'None', image: 'assets/images/covers/none.png' }, // всегда последним
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
