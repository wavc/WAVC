export class Media {
    audioDevices = [] as [string, string][];
    videoDevices = [] as [string, string][];
    onUpdateSettings: (needsUpdate: { video: boolean, audio: boolean }) => void;
    myStream = { video: null, audio: null } as { video: MediaStream, audio: MediaStream };
    localVideo: HTMLVideoElement;
    makeUpdateButton: () => void;
    isPreviewAudioOn: boolean;
    addDeviceOption: (list: [string, string][], name: string, select: (n: number) => boolean) => void;
    checkSelectedDevice: (str: string) => number;

    selectedAudioDevice: any = false;
    selectedVideoDevice: any = false;

    needsUpdate = { video: false, audio: false };

    static AddTracks(trackList, stream) {
        trackList.forEach(track => { track.mode = 'showing'; stream.addTrack(track); });
    }
    static RemoveTracks(trackList, stream, stop = false) {
        trackList.forEach(track => {
            if (stop) {
                track.stop();
            }
            stream.removeTrack(track);
        });
    }

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
                for (const device of deviceList) {
                    if (device.deviceId !== 'default') {
                        if (device.kind === 'audioinput') {
                            this.audioDevices.push([device.deviceId, device.label]);
                        } else if (device.kind === 'videoinput') {
                            this.videoDevices.push([device.deviceId, device.label]);
                        }
                    }
                }
                this.addDeviceOption(this.audioDevices, 'audio', (i) => i === 0);
                this.addDeviceOption(this.videoDevices, 'video', (i) => i === this.videoDevices.length);
                if (this.audioDevices.length > 1 || this.videoDevices.length > 1) {
                    this.makeUpdateButton();
                }
            }).
            catch((msg) => console.log(msg));

        await this.UpdateAudio({ audio: true });
    }
    StopVideo() {
        if (this.myStream.video != null) {
            this.myStream.video.getTracks().forEach(track => {
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
        this.myStream.video = await navigator.mediaDevices.getUserMedia(constraints);
        const localVideoTracks = (this.localVideo.srcObject as MediaStream).getVideoTracks();
        Media.RemoveTracks(localVideoTracks, this.localVideo.srcObject);
        Media.AddTracks(this.myStream.video.getTracks(), this.localVideo.srcObject);
    }
    async UpdateAudio(constraints) {
        this.StopAudio();
        this.myStream.audio = await navigator.mediaDevices.getUserMedia(constraints);
        this.PreviewAudio(this.isPreviewAudioOn);
    }

    PreviewAudio(on) {
        const localAudioTracks = (this.localVideo.srcObject as MediaStream).getAudioTracks();
        Media.RemoveTracks(localAudioTracks, this.localVideo.srcObject, false);
        if (on) {
            Media.AddTracks(this.myStream.audio.getTracks(), this.localVideo.srcObject);
        }
        this.isPreviewAudioOn = on;
    }

    ApplyUpdateSettings() {
        this.onUpdateSettings(this.needsUpdate);
    }

    async UpdateSettings() {
        const audioDeviceId = this.checkSelectedDevice('audio_devices');
        const newSelectedAudioDevice = this.SelectDevice(audioDeviceId, this.audioDevices);
        const videoDeviceId = this.checkSelectedDevice('video_devices');
        const newSelectedVideoDevice = this.SelectDevice(videoDeviceId, this.videoDevices);
        this.needsUpdate = { video: false, audio: false };

        if (JSON.stringify(newSelectedAudioDevice) !== JSON.stringify(this.selectedAudioDevice)) {
            this.selectedAudioDevice = newSelectedAudioDevice;
            if (this.selectedAudioDevice) {
                const constraintsAudio = {
                    audio: this.selectedAudioDevice
                };
                await this.UpdateAudio(constraintsAudio);
            } else {
                this.StopAudio();
            }
            this.needsUpdate.audio = true;
        }
        if (JSON.stringify(newSelectedVideoDevice) !== JSON.stringify(this.selectedVideoDevice)) {
            this.selectedVideoDevice = newSelectedVideoDevice;
            if (this.selectedVideoDevice) {
                const constraintsVideo = {
                    video: this.selectedVideoDevice
                };
                await this.UpdateVideo(constraintsVideo);
            } else {
                this.StopVideo();
            }
            this.needsUpdate.video = true;
        }
    }

    SelectDevice(deviceId, deviceList) {
        if (deviceId !== '-1') {
            if (deviceId !== null) {
                return { deviceId: { exact: deviceList[deviceId][0] } };
            } else if (deviceList.length !== 0) {
                return { deviceId: { exact: deviceList[0][0] } };
            }
        }
        return false;
    }
}
