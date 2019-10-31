import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Media } from './helperClasses/media';
import { Broker } from './helperClasses/broker';
import { Util } from './helperClasses/util';
import { PeerConnection } from './helperClasses/peerConnection';
@Component({
  selector: 'app-audio-and-video-page',
  templateUrl: './audio-and-video-page.component.html',
  styleUrls: ['./audio-and-video-page.component.css']
})
export class AudioAndVideoPageComponent implements OnInit {
  media: Media;
  peerCon: PeerConnection;
  broker: Broker;
  callId: number;
  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.callId = params.id;
    });
    this.Start();
  }
  MakeUpdateButtonVisible() {
    document.getElementById("update_button").removeAttribute("hidden");
  }

  AddRemoteVideoElement(remoteStream, id, name) {
    var div = document.getElementById(id);
    if (div != null) {
      //element exists, just add to it
      div.childNodes.forEach(node => {
        if (node.nodeName == "VIDEO")
          Media.AddTracks(remoteStream.getTracks(), (node as HTMLVideoElement).srcObject);
      });
    }
    else {
      //element doesn't exist, create it
      var container = document.getElementById("video_container");
      var videoHolder = document.createElement("div");
      videoHolder.setAttribute("id", id);
      videoHolder.innerHTML += name + "<br/>";
      var video = document.createElement("video");
      video.setAttribute("autoplay", "");
      video.setAttribute("playinline", "");
      video.srcObject = remoteStream;
      videoHolder.appendChild(video);
      container.appendChild(videoHolder);
    }
  }


  async Start() {
    var videoElement = document.getElementById("camera_preview");

    this.media = new Media(this.MakeUpdateButtonVisible, videoElement, false, Util.AddRadio, Util.GetSelectedRadio);
    await this.media.SetUpMedia();

    this.peerCon = new PeerConnection(this.media.myStream, this.AddRemoteVideoElement);

    this.media.onUpdateSettings = () => this.peerCon.UpdateCall;

    this.broker = new Broker(await this.peerCon.PeerId, () => this.peerCon.calls, (arg) => this.peerCon.MakeCall(arg, null, null), (val) => this.peerCon.UpdateMyName(val));
    await this.broker.StartConnection(this.callId);
  }
}
