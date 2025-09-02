import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';

import { DesignCoverComponent } from '../design-cover/design-cover.component';

export interface DesignSection {
  id: string;
  name: string;
  icon: string;
  component: any;
}

@Injectable()
export class DesignService {
  private _sectionTitle = signal<string>('ДИЗАЙН');
  private _sections = signal<DesignSection[]>([]);
  private readonly router: Router = inject(Router);
  sections = this._sections.asReadonly();
  sectionTitle = this._sectionTitle.asReadonly();

  constructor() {
    this.registerSections();
  }

  private registerSections(): void {
    this._sections.set([
      {
        id: 'cover',
        name: 'Обложка',
        icon: 'assets/icons/images.svg',
        component: DesignCoverComponent,
      },
      /* {
        id: 'fontset',
        name: 'Типографика',
        icon: 'assets/icons/t.svg',
        component: DesignTypographyComponent,
      },
      {
        id: 'color',
        name: 'Цвет',
        icon: 'assets/icons/color.svg',
        component: DesignColorComponent,
      },
      {
        id: 'grid',
        name: 'Сетка',
        icon: 'assets/icons/grid.svg',
        component: DesignGridComponent,
      },*/
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
