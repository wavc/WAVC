import Peer from 'peerjs';
import { Util } from './util';
import { Stream } from 'stream';

export class PeerConnection {
    peer: Peer;
    calls: {
        localVideoCall: Peer.MediaConnection,
        localAudioCall: Peer.MediaConnection,
        remoteVideoCall: Peer.MediaConnection,
        remoteAudioCall: Peer.MediaConnection,
        name: string
    }[] = [];
    myName = '';
    stream: { video: MediaStream, audio: MediaStream };
    isSendingAudio: boolean;
    isSendingVideo: boolean;
    HandleRemoteVideo: (stream: Stream, id: string, name: string, type: string) => void;

    constructor(stream, HandleRemoteVideo) {
        this.peer = new Peer();
        this.stream = stream;
        this.HandleRemoteVideo = HandleRemoteVideo;

        const me = this;
        this.peer.on('call', (call) => {
            call.answer();
            me.SetCallName(call.peer, call.metadata.caller);
            me.SetUpCall(call);
        });
        this.peer.on('close', () => { console.log('closed'); });
        this.peer.on('disconnected', () => { console.log('disconected'); });
        this.peer.on('error', (e) => { console.log(e); });
    }
    get PeerId() {
        const promise = new Promise((r) => {
            Util.WaitForObject(this.peer, p => p.id === undefined, (p) => {
                r(p.id);
            });
        });
        return promise;
    }
    SetUpCall(call) {
        const me = this;
        call.on('stream', (remoteStream) => {
            const remoteName = me.calls[call.peer].name;

            if (call.metadata.type === 'video') {
                if (me.calls[call.peer].remoteVideoCall != null) {
                    Util.DeleteElement(call.peer + '-' + call.metadata.type);
                    me.calls[call.peer].remoteVideoCall.close();
                }
                me.calls[call.peer].remoteVideoCall = call;
            } else if (call.metadata.type === 'audio') {
                if (me.calls[call.peer].remoteAudioCall != null) {
                    Util.DeleteElement(call.peer + '-' + call.metadata.type);
                    me.calls[call.peer].remoteAudioCall.close();
                }
                me.calls[call.peer].remoteAudioCall = call;
            }

            // display stream
            me.HandleRemoteVideo(remoteStream, call.peer, remoteName, call.metadata.type);

            // if hasn't called yet
            if (me.calls[call.peer].localAudioCall == null && me.calls[call.peer].localVideoCall == null) {
                me.MakeCallAllTypes({ name: remoteName, peerId: call.peer });
            }
        });
        call.on('close', () => {
            const callObj = me.calls[call.peer];
            if (callObj.localAudioCall === call || callObj.localVideoCall === call) {
                if (call.metadata.type === 'video') {
                    callObj.localVideoCall = null;
                }
                if (call.metadata.type === 'audio') {
                    callObj.localAudioCall = null;
                }
                return;
            }
            if (call.metadata.type === 'video') {
                callObj.remoteVideoCall = null;
            }
            if (call.metadata.type === 'audio') {
                callObj.remoteAudioCall = null;
            }
            Util.DeleteElement(call.peer + '-' + call.metadata.type);
            if (callObj.remoteAudioCall == null
                && callObj.remoteVideoCall == null
                && callObj.localAudioCall == null
                && callObj.localVideoCall == null
            ) {
                Util.DeleteElement(call.peer);
                delete me.calls[call.peer];
            }

        });
    }
    UpdateCall(needsUpdate = { audio: true, video: true }) {
        for (const key in this.calls) {
            if (this.calls.hasOwnProperty(key)) {
                this.MakeCallAllTypes({ name: this.calls[key].name, peerId: key }, needsUpdate);
            }
        }
    }
    MakeCallAllTypes(user: { name: string, peerId: any }, needsUpdate = { audio: true, video: true }) {
        if (needsUpdate.audio) {
            if (this.stream.audio != null) {
                this.MakeCall(user, this.stream.audio, 'audio');
            } else if (this.calls[user.peerId] !== undefined && this.calls[user.peerId].localAudioCall !== null) {
                this.calls[user.peerId].localAudioCall.close();
            }
        }
        if (needsUpdate.video) {
            if (this.stream.video != null) {
                this.MakeCall(user, this.stream.video, 'video');
            } else if (this.calls[user.peerId] !== undefined && this.calls[user.peerId].localVideoCall !== null) {
                this.calls[user.peerId].localVideoCall.close();
            }
        }
    }

    MakeCall(user: { name: string, peerId: string }, stream: MediaStream, type: string) {
        const call = this.peer.call(user.peerId, stream, { metadata: { caller: this.myName, recipient: user.name, type } });
        this.SetCallName(call.peer, user.name);
        if (type === 'video') {
            this.calls[call.peer as any].localVideoCall = call;
        } else if (type === 'audio') {
            this.calls[call.peer as any].localAudioCall = call;
        }
        this.SetUpCall(call);
    }

    SetCallName(id: string, remoteName: string) {
        if (this.calls[id] === undefined) {
            this.calls[id] = {
                localVideoCall: null,
                localAudioCall: null,
                remoteVideoCall: null,
                remoteAudioCall: null,
                name: remoteName
            };
        }
    }

    UpdateMyName(value) {
        this.myName = value;
    }
}
