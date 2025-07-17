import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EasyChoiceComponent } from './easy-choice.component';

describe('EasyChoiceComponent', () => {
  let component: EasyChoiceComponent;
  let fixture: ComponentFixture<EasyChoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EasyChoiceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EasyChoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
