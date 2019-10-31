export class Media {
    audioDevices = [] as [string, string][];
    videoDevices = [] as [string, string][];
    onUpdateSettings: () => void;
    myStream = { video: null, audio: null } as { video: MediaStream, audio: MediaStream};
    localVideo: HTMLVideoElement;
    makeUpdateButton: () => void;
    isPreviewAudioOn: boolean;
    addDeviceOption: (list: [string, string][], name: string, select: (number)=>boolean) => void;
    checkSelectedDevice: (string) => number;

    constructor(makeUpdateButton, localVideo, isPreviewAudioOn, addDeviceOption, checkSelectedDevice) {
        this.localVideo = localVideo;
        this.makeUpdateButton = makeUpdateButton;
        this.isPreviewAudioOn = isPreviewAudioOn;
        this.addDeviceOption = addDeviceOption;
        this.checkSelectedDevice = checkSelectedDevice;

        localVideo.srcObject = new MediaStream();
    }

    async SetUpMedia() {
        
        navigator.mediaDevices.enumerateDevices().
            then((deviceList) => {
                for (var i = 0; i < deviceList.length; i++) {
                    if (deviceList[i].deviceId !== 'default') {
                        if (deviceList[i].kind === 'audioinput')
                            this.audioDevices.push([deviceList[i].deviceId, deviceList[i].label]);
                        else if (deviceList[i].kind === 'videoinput')
                            this.videoDevices.push([deviceList[i].deviceId, deviceList[i].label]);
                    }
                }
                this.addDeviceOption(this.audioDevices, "audio", (i) => i == this.audioDevices.length);
                this.addDeviceOption(this.videoDevices, "video", (i) => i == 0);
                if (this.audioDevices.length > 1 || this.videoDevices.length > 1) {
                    this.makeUpdateButton();
                }
            }).
            catch((msg) => console.log(msg));

        await this.UpdateVideo({ video: true });
    }
    StopVideo() {
        if (this.myStream.video != null) {
            this.myStream.video.getTracks().forEach(function (track) {
                track.stop();
            });
            this.myStream.video = null;
        }
    }
    StopAudio() {
        if (this.myStream.audio != null) {
            this.myStream.audio.getTracks().forEach(track => {
                track.stop();
            });
            this.myStream.audio = null;
        }
    }
    async UpdateVideo(constraints) {
        this.StopVideo();
        var stream = await navigator.mediaDevices.getUserMedia(constraints);
        this.myStream.video = stream;
        //remove old stream
        Media.RemoveTracks((this.localVideo.srcObject as MediaStream).getVideoTracks(), this.localVideo.srcObject);
        //add new stream
        Media.AddTracks(stream.getTracks(), this.localVideo.srcObject);
    }
    async UpdateAudio(constraints) {
        this.StopAudio();
        var stream = await navigator.mediaDevices.getUserMedia(constraints);
        this.myStream.audio = stream;
        //add to preview is checkbox was set
        this.PreviewAudio(this.isPreviewAudioOn);
    }

    PreviewAudio(on) {
        if (on) {
            Media.RemoveTracks((this.localVideo.srcObject as MediaStream).getAudioTracks(), this.localVideo.srcObject, false)
        }
        else {
            Media.AddTracks(this.myStream.audio.getTracks(), this.localVideo.srcObject);
        }
        this.isPreviewAudioOn = on;
    }
    
    async UpdateSettings() {
        var audioDeviceId = this.checkSelectedDevice('audio_devices');
        var selectedAudioDevice = this.SelectDevice(audioDeviceId, this.audioDevices);
        var videoDeviceId = this.checkSelectedDevice('video_devices');
        var selectedVideoDevice = this.SelectDevice(videoDeviceId, this.videoDevices);

        if (selectedVideoDevice) {
            var constraintsVideo = {
                video: selectedVideoDevice
            };
            await this.UpdateVideo(constraintsVideo);
        }
        else
            this.StopVideo();
        if (selectedAudioDevice) {
            var constraintsAudio = {
                audio: selectedAudioDevice
            };
            await this.UpdateAudio(constraintsAudio);
        }
        else
            this.StopAudio();

        this.onUpdateSettings();
    }

    SelectDevice(deviceId, deviceList) {

        if (deviceId != null && deviceId != -1) {
            return { deviceId: { exact: deviceList[deviceId][0] } };
        } else if (deviceList.length !== 0) {
            return { deviceId: { exact: deviceList[0][0] } };
        }
        return false;
    }

    static AddTracks(trackList, stream) {
        trackList.forEach(track => stream.addTrack(track));
    }
    static RemoveTracks(trackList, stream, stop = false) {
        trackList.forEach(track => {
            if (stop) track.stop();
            stream.removeTrack(track)
        });
    }
}