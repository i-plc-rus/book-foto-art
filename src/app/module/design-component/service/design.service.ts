import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { DesignCoverComponent } from '../design-cover/design-cover.component';
import { DesignTypographyComponent } from '../design-typography/design-typography.component';
import { DesignColorComponent } from '../design-color/design-color.component';
import { DesignGridComponent } from '../design-grid/design-grid.component';

export interface DesignSection {
  id: string;
  name: string;
  icon: string;
  component: any;
}

@Injectable()
export class DesignService {
  private _sectionTitle = signal<string>('DESIGN');
  private _sections = signal<DesignSection[]>([]);
  sections = this._sections.asReadonly();
  sectionTitle = this._sectionTitle.asReadonly();

  constructor(private router: Router) {
    this.registerSections();
  }

  private registerSections() {
    this._sections.set([
      {
        id: 'cover',
        name: 'Cover',
        icon: 'assets/icons/images.svg',
        component: DesignCoverComponent,
      },
      {
        id: 'fontset',
        name: 'Typography',
        icon: 'assets/icons/t.svg',
        component: DesignTypographyComponent,
      },
      {
        id: 'color',
        name: 'Color',
        icon: 'assets/icons/color.svg',
        component: DesignColorComponent,
      },
      {
        id: 'grid',
        name: 'Grid',
        icon: 'assets/icons/grid.svg',
        component: DesignGridComponent,
      },
    ]);
  }

  setSectionTitle(title: string) {
    this._sectionTitle.set(title);
  }

  navigateToSection(sectionId: string) {
    this.router.navigate(['design', sectionId]).catch();
  }

  getActiveSection() {
    const segments = this.router.url.split('/');
    const sectionId = segments[segments.length - 1];
    return this._sections().find((s) => s.id === sectionId) || this._sections()[0];
  }
}
