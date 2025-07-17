import { Component } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { GallerySwitcherComponent } from '../gallery-switcher/gallery-switcher.component';
import { MobileBluurDemoComponent } from "../mobile-bluur-demo/mobile-bluur-demo.component";

@Component({
  selector: 'app-home',
  imports: [HeaderComponent, GallerySwitcherComponent, MobileBluurDemoComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

   

}
