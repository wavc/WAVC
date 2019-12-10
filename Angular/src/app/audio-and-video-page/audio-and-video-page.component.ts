import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Media } from './helperClasses/media';
import { Broker } from './helperClasses/broker';
import { Util } from './helperClasses/util';
import { PeerConnection } from './helperClasses/peerConnection';
import { ProfileService } from '../services/profile.service';
import { constants } from 'os';
@Component({
  selector: 'app-audio-and-video-page',
  templateUrl: './audio-and-video-page.component.html',
  styleUrls: ['./audio-and-video-page.component.css']
})
export class AudioAndVideoPageComponent implements OnInit {
  media: Media;
  peerCon: PeerConnection;
  broker: Broker;
  callId: string;
  userId: string;
  audioOn = true;
  lastSelectedAudio = '0';
  videoOn = false;
  lastSelectedVideo = '0';
  constructor(private route: ActivatedRoute, private profileSerivce: ProfileService) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.callId = params.id;
    });
    this.profileSerivce.getProfile().subscribe(profile => {
      this.userId = profile.id;
      this.Start();

    });
    window.addEventListener('beforeunload', this.Stop);
  }

  MakeUpdateButtonVisible() {
    document.getElementById('update_button').removeAttribute('hidden');
  }

  AddRemoteVideoElement(remoteStream, id, name, type) {
    const div = document.getElementById(id);
    if (div != null) {
      const videoHolderElement = document.getElementById(id);
      const video = document.createElement(type);
      video.setAttribute('id', id + '-' + type);
      video.setAttribute('autoplay', '');
      video.setAttribute('playinline', '');
      video.srcObject = remoteStream;
      videoHolderElement.prepend(video);
    } else {
      // element doesn't exist, create it
      const container = document.getElementById('video_container');
      const videoHolder = document.createElement('div');
      videoHolder.setAttribute('id', id);
      videoHolder.setAttribute('class', 'align-self-center');

      const nameElement = document.createElement('div');
      nameElement.setAttribute('class', 'text-center');
      nameElement.innerHTML = name;

      const video = document.createElement(type);
      video.setAttribute('id', id + '-' + type);
      video.setAttribute('autoplay', '');
      video.setAttribute('playinline', '');
      video.srcObject = remoteStream;

      videoHolder.prepend(video);
      videoHolder.append(nameElement);
      container.append(videoHolder);
    }
  }

  async Start() {
    const videoElement = document.getElementById('camera_preview');

    this.media = new Media(this.MakeUpdateButtonVisible, videoElement, false, Util.AddRadio, Util.GetSelectedRadio);
    await this.media.SetUpMedia();

    this.peerCon = new PeerConnection(this.media.myStream, this.AddRemoteVideoElement);

    this.media.onUpdateSettings = (needsUpdate: { video: boolean, audio: boolean }) => {
      this.peerCon.UpdateCall(needsUpdate);
      this.ToggleIcon('video', this.media.myStream.video !== null);
      this.ToggleIcon('microphone', this.media.myStream.audio !== null);
    };

    this.broker = new Broker(
      await this.peerCon.PeerId,
      () => this.peerCon.calls,
      (user) => this.peerCon.MakeCallAllTypes(user),
      (name) => this.peerCon.UpdateMyName(name)
    );
    await this.broker.StartConnection(this.userId, this.callId);
  }

  Stop() {
    close();
  }

  async ToggleAudio() {
    const radioName = 'audio_devices';
    const selected = Util.GetSelectedRadio(radioName);
    let toCheck;
    if (this.audioOn) {
      this.lastSelectedAudio = selected;
      Util.GetSelectedRadioElement(radioName, '-1').checked = true;
      toCheck = '-1';
    } else {
      if (selected == null) {
        return;
      }
      toCheck = this.lastSelectedAudio;
    }
    Util.GetSelectedRadioElement(radioName, toCheck).checked = true;
    this.audioOn = !this.audioOn;
    await this.media.UpdateSettings();
    this.media.ApplyUpdateSettings();
  }

  async ToggleVideo() {
    const radioName = 'video_devices';
    const selected = Util.GetSelectedRadio(radioName);
    let toCheck;
    if (this.videoOn) {
      this.lastSelectedVideo = selected;
      toCheck = '-1';
    } else {
      if (selected == null) {
        return;
      }
      toCheck = this.lastSelectedVideo;
    }
    Util.GetSelectedRadioElement(radioName, toCheck).checked = true;
    this.videoOn = !this.videoOn;
    await this.media.UpdateSettings();
    this.media.ApplyUpdateSettings();
  }

  ToggleIcon(name: string, turnOn: boolean) {
    const icon = document.getElementById(name + '-icon');
    if (turnOn) {
      icon.classList.remove('fa-' + name + '-slash');
      icon.classList.add('fa-' + name);
    } else {
      icon.classList.remove('fa-' + name);
      icon.classList.add('fa-' + name + '-slash');
    }
  }
}
