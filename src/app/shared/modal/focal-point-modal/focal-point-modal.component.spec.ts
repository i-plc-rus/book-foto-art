import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FocalPointModalComponent } from './focal-point-modal.component';

describe('FocalPointModalComponent', () => {
  let component: FocalPointModalComponent;
  let fixture: ComponentFixture<FocalPointModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FocalPointModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FocalPointModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
