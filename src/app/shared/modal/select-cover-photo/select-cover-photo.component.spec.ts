import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectCoverPhotoComponent } from './select-cover-photo.component';

describe('SelectCoverPhotoComponent', () => {
  let component: SelectCoverPhotoComponent;
  let fixture: ComponentFixture<SelectCoverPhotoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectCoverPhotoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SelectCoverPhotoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
