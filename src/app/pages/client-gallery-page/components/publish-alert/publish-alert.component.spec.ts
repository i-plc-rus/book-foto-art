import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublishAlertComponent } from './publish-alert.component';

describe('PublishAlertComponent', () => {
  let component: PublishAlertComponent;
  let fixture: ComponentFixture<PublishAlertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PublishAlertComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PublishAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
