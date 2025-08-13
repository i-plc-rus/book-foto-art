import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GallerySwitcherComponent } from './gallery-switcher.component';

describe('GallerySwitcherComponent', () => {
  let component: GallerySwitcherComponent;
  let fixture: ComponentFixture<GallerySwitcherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GallerySwitcherComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GallerySwitcherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
