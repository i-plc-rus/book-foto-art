import { Component, inject } from '@angular/core';

import type { DesignSection } from '../../../module/design-component/service/design.service';
import { DesignService } from '../../../module/design-component/service/design.service';

@Component({
  standalone: true,
  selector: 'app-design-sections',
  templateUrl: './design-sections.component.html',
  styleUrl: './design-sections.component.css',
  providers: [DesignService],
})
export class DesignSectionsComponent {
  readonly designService = inject(DesignService);

  isActiveSession(section: DesignSection): boolean {
    return this.designService.getActiveSection()?.id === section.id;
  }
}
