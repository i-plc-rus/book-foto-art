import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesignColorComponent } from './design-color.component';

describe('DesignColorComponent', () => {
  let component: DesignColorComponent;
  let fixture: ComponentFixture<DesignColorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DesignColorComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DesignColorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
