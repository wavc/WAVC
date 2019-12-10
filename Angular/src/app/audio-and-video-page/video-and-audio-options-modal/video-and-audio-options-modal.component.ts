import { Component, OnInit, Input } from '@angular/core';
import { Media } from '../helperClasses/media';

@Component({
  selector: 'app-video-and-audio-options-modal',
  templateUrl: './video-and-audio-options-modal.component.html',
  styleUrls: ['./video-and-audio-options-modal.component.css']
})
export class VideoAndAudioOptionsModalComponent implements OnInit {
  @Input() media: Media;
  constructor() { }

  ngOnInit() {
  }

}
