import {Routes} from '@angular/router';
import {DesignCoverComponent} from './design-cover/design-cover.component';
import {DesignTypographyComponent} from './design-typography/design-typography.component';
import {DesignColorComponent} from './design-color/design-color.component';
import {DesignGridComponent} from './design-grid/design-grid.component';

export const DESIGN_ROUTES: Routes = [
  {
    path: '',
    children: [
      {path: 'cover', component: DesignCoverComponent},
      {path: 'fontset', component: DesignTypographyComponent},
      {path: 'color', component: DesignColorComponent},
      {path: 'grid', component: DesignGridComponent},
      {path: '', redirectTo: 'cover', pathMatch: 'full'}
    ]
  }
];
