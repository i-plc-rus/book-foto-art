import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YandexCallbackComponent } from './yandex-callback.component';

describe('YandexCallbackComponent', () => {
  let component: YandexCallbackComponent;
  let fixture: ComponentFixture<YandexCallbackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [YandexCallbackComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(YandexCallbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
