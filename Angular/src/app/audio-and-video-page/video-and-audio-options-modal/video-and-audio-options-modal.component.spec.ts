import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoAndAudioOptionsModalComponent } from './video-and-audio-options-modal.component';

describe('VideoAndAudioOptionsModalComponent', () => {
  let component: VideoAndAudioOptionsModalComponent;
  let fixture: ComponentFixture<VideoAndAudioOptionsModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VideoAndAudioOptionsModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VideoAndAudioOptionsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
