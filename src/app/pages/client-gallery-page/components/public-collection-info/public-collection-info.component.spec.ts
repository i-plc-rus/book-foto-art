import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicCollectionInfoComponent } from './public-collection-info.component';

describe('PublicCollectionInfoComponent', () => {
  let component: PublicCollectionInfoComponent;
  let fixture: ComponentFixture<PublicCollectionInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PublicCollectionInfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PublicCollectionInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
