import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileBluurDemoComponent } from './mobile-bluur-demo.component';

describe('MobileBluurDemoComponent', () => {
  let component: MobileBluurDemoComponent;
  let fixture: ComponentFixture<MobileBluurDemoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MobileBluurDemoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MobileBluurDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
