import { Component } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { GallerySwitcherComponent } from './gallery-switcher/gallery-switcher.component';
import { MobileBluurDemoComponent } from './mobile-bluur-demo/mobile-bluur-demo.component';
import { DigitalDeliveryComponent } from './digital-delivery/digital-delivery.component';
import { EasyChoiceComponent } from './easy-choice/easy-choice.component';
import { ShopSectionComponent } from './shop-section/shop-section.component';
import { GetStartedComponent } from './get-started/get-started.component';
import { FooterComponent } from './footer/footer.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [
    HeaderComponent,
    GallerySwitcherComponent,
    MobileBluurDemoComponent,
    DigitalDeliveryComponent,
    EasyChoiceComponent,
    ShopSectionComponent,
    GetStartedComponent,
    FooterComponent,
    RouterLink,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {}
