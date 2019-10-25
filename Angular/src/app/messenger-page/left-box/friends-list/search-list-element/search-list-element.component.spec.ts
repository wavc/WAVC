import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchListElementComponent } from './search-list-element.component';

describe('SearchListElementComponent', () => {
  let component: SearchListElementComponent;
  let fixture: ComponentFixture<SearchListElementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchListElementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchListElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
