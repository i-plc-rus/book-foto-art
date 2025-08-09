import {Component, inject} from '@angular/core';
import {DesignService} from '../../../module/design-component/service/design.service';

@Component({
  standalone: true,
  selector: 'app-design-sections',
  templateUrl: './design-sections.component.html',
  styleUrl: './design-sections.component.css',
  providers: [DesignService]
})
export class DesignSectionsComponent {
  readonly designService = inject(DesignService);
}
