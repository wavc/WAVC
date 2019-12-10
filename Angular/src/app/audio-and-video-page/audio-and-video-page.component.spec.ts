import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AudioAndVideoPageComponent } from './audio-and-video-page.component';

describe('AudioAndVideoPageComponent', () => {
  let component: AudioAndVideoPageComponent;
  let fixture: ComponentFixture<AudioAndVideoPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AudioAndVideoPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AudioAndVideoPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
