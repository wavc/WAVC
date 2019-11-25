import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VirtualBoardComponent } from './virtual-board.component';

describe('VirtualBoardComponent', () => {
  let component: VirtualBoardComponent;
  let fixture: ComponentFixture<VirtualBoardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VirtualBoardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VirtualBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
