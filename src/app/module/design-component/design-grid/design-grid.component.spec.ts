import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesignGridComponent } from './design-grid.component';

describe('DesignGridComponent', () => {
  let component: DesignGridComponent;
  let fixture: ComponentFixture<DesignGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DesignGridComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DesignGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
