import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientGalleryComponent } from './client-gallery.component';

describe('ClientGalleryComponent', () => {
  let component: ClientGalleryComponent;
  let fixture: ComponentFixture<ClientGalleryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientGalleryComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ClientGalleryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
