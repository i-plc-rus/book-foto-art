import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesignCoverComponent } from './design-cover.component';

describe('DesignCoverComponent', () => {
  let component: DesignCoverComponent;
  let fixture: ComponentFixture<DesignCoverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DesignCoverComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DesignCoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
