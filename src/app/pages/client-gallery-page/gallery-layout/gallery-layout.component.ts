import { Component } from '@angular/core';
import {SidebarComponent} from '../../sidebar/sidebar.component';

@Component({
  standalone: true,
  selector: 'app-gallery-layout',
  templateUrl: './gallery-layout.component.html',
  styleUrl: './gallery-layout.component.css',
  imports: [
    SidebarComponent
  ]
})
export class GalleryLayoutComponent {

}
