import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesignTypographyComponent } from './design-typography.component';

describe('DesignTypographyComponent', () => {
  let component: DesignTypographyComponent;
  let fixture: ComponentFixture<DesignTypographyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DesignTypographyComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DesignTypographyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
