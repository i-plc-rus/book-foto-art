import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopSectionComponent } from './shop-section.component';

describe('ShopSectionComponent', () => {
  let component: ShopSectionComponent;
  let fixture: ComponentFixture<ShopSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShopSectionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ShopSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
