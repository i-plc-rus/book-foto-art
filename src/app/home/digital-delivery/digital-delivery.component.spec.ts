import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DigitalDeliveryComponent } from './digital-delivery.component';

describe('DigitalDeliveryComponent', () => {
  let component: DigitalDeliveryComponent;
  let fixture: ComponentFixture<DigitalDeliveryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DigitalDeliveryComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DigitalDeliveryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
