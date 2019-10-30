import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileEditorModalComponent } from './profile-editor-modal.component';

describe('ProfileEditorModalComponent', () => {
  let component: ProfileEditorModalComponent;
  let fixture: ComponentFixture<ProfileEditorModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileEditorModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileEditorModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
