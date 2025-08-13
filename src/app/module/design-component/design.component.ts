import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-design-component',
  templateUrl: './design.component.html',
  imports: [RouterOutlet],
})
export class DesignComponent {}
