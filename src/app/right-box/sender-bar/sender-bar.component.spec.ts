/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SenderBarComponent } from './sender-bar.component';

describe('SenderBarComponent', () => {
  let component: SenderBarComponent;
  let fixture: ComponentFixture<SenderBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SenderBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SenderBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
