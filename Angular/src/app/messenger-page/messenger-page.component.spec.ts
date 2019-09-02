import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MessengerPageComponent } from './messenger-page.component';

describe('MessengerPageComponent', () => {
  let component: MessengerPageComponent;
  let fixture: ComponentFixture<MessengerPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MessengerPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MessengerPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
