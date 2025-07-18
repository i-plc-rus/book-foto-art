import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhotoLabComponent } from './photo-lab.component';

describe('PhotoLabComponent', () => {
  let component: PhotoLabComponent;
  let fixture: ComponentFixture<PhotoLabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PhotoLabComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PhotoLabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
