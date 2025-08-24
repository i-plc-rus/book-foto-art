import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublishConfirmDialogComponent } from './publish-confirm-dialog.component';

describe('PublishAlertComponent', () => {
  let component: PublishConfirmDialogComponent;
  let fixture: ComponentFixture<PublishConfirmDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PublishConfirmDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PublishConfirmDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
