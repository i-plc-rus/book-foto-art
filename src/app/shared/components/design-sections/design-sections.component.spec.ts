import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesignSectionsComponent } from './design-sections.component';

describe('DesignSectionsComponent', () => {
  let component: DesignSectionsComponent;
  let fixture: ComponentFixture<DesignSectionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DesignSectionsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DesignSectionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
