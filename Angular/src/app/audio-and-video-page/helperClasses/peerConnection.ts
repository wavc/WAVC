import Peer from 'peerjs';
import { Util } from './util';
import { Stream } from 'stream';

export class PeerConnection {
    peer: Peer;
    calls: { localVideoCall: Peer.MediaConnection, localAudioCall: Peer.MediaConnection, remoteVideoCall: Peer.MediaConnection, remoteAudioCall: Peer.MediaConnection, name: string }[] = [];
    myName: string = '';
    stream: { video: MediaStream, audio: MediaStream };
    isSendingAudio: boolean;
    isSendingVideo: boolean;
    HandleRemoteVideo: (stream: Stream, id: string, name: string) => void;

    constructor(stream, HandleRemoteVideo) {
        this.peer = new Peer();
        this.stream = stream;
        this.HandleRemoteVideo = HandleRemoteVideo;

        var me = this;
        this.peer.on('call', function (call) {
            if (me.calls[call.peer] == undefined) {
                me.calls[call.peer] = { localVideoCall: null, localAudioCall: null, remoteVideoCall: null, remoteAudioCall: null, name: null };
            }
            me.SetUpCall(call);
        });
        this.peer.on('close', () => { console.log("closed"); });
        this.peer.on('disconnected', () => { console.log("disconected"); });
        this.peer.on('error', (e) => { console.log(e); });
    }
    get PeerId() {
        var promise = new Promise((r) => {
            Util.WaitForObject(this.peer, p => p.id === undefined, (p) => {
                r(p.id);
            });
        });
        return promise;
    }
    SetUpCall(call) {
        var me = this;
        call.on('stream', function (remoteStream) {
            console.log(call.metadata);
            if (call.metadata.type == "video") {
                if (me.calls[call.peer].remoteVideoCall != null)
                    me.calls[call.peer].remoteVideoCall.close();
                me.calls[call.peer].remoteVideoCall = call;
            }
            else if (call.metadata.type == "audio") {
                if (me.calls[call.peer].remoteAudioCall != null)
                    me.calls[call.peer].remoteAudioCall.close();
                me.calls[call.peer].remoteAudioCall = call;
            }

            if (me.calls[call.peer].name == null) {
                //resolve who is calling
                var remoteName;
                if (me.myName == call.metadata.caller)
                    remoteName = call.metadata.recipient;
                else
                    remoteName = call.metadata.caller;
                me.calls[call.peer].name = remoteName;
                me.MakeCallAllTypes({name: remoteName, peerId: call.peer});
            }

            //display stream
            me.HandleRemoteVideo(remoteStream, call.id, remoteName);
        });
        call.on('close', function () {
            console.log("Closed Stream");
            var callObj = me.calls[call.peer];
            if (call.metadata.type == "video") {
                callObj.remoteVideoCall = null;
            }
            if (call.metadata.type == "audio") {
                callObj.remoteAudioCall = null;
            }
            if (callObj.remoteAudioCall == null && callObj.remoteVideoCall == null && callObj.localAudioCall == null && callObj.localVideoCall == null) {
                Util.DeleteElement(call.id);
                delete me.calls[call.peer];
            }

        });
    }
    UpdateCall() {
        for (var key in this.calls) {
            this.MakeCallAllTypes({ name: this.calls[key].name, peerId: key });
        }
    }
    MakeCallAllTypes(user: { name: string, peerId: string }) {
        console.log("MakeCallAllTypes");
        console.log(this.stream);
        if (this.stream.audio != null)
            this.MakeCall(user, this.stream.audio, 'audio');
        if (this.stream.video != null)
            this.MakeCall(user, this.stream.video, 'video');
    }


    MakeCall(user: { name: string, peerId: string }, stream: MediaStream, type: string) {
        var call = this.peer.call(user.peerId, stream, { metadata: { caller: this.myName, recipient: user.name, type: type } });
        this.SetUpCall(call);
    }
    UpdateMyName(value) {
        this.myName = value;
    }
}