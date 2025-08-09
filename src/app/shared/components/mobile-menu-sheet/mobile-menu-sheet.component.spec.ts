import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileMenuSheetComponent } from './mobile-menu-sheet.component';

describe('MobileMenuSheetComponent', () => {
  let component: MobileMenuSheetComponent;
  let fixture: ComponentFixture<MobileMenuSheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MobileMenuSheetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MobileMenuSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
