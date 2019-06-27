var audioDevices = [];
var videoDevices = [];
var localVideo;

function SetUpMedia() {
    localVideo = document.getElementById("camera_preview");
    navigator.mediaDevices.enumerateDevices().
        then((deviceList) => {
            for (var i = 0; i < deviceList.length; i++) {
                if (deviceList[i].deviceId !== 'default') {
                    if (deviceList[i].kind === 'audioinput')
                        audioDevices.push([deviceList[i].deviceId, deviceList[i].label]);
                    else if (deviceList[i].kind === 'videoinput')
                        videoDevices.push([deviceList[i].deviceId, deviceList[i].label]);
                }
            }
            AddRadio(audioDevices, "audio", (i) => i == audioDevices.length);
            AddRadio(videoDevices, "video", (i) => i == 0);
            if (audioDevices.length > 1 || videoDevices.length > 1) {
                document.getElementById("update_button").innerHTML =
                    '<input type="button" value="Update" onclick="UpdateButton()"/>';
            }
        }).
        catch((msg) => console.log(msg));
    UpdateVideo({ video: true });
}
function StopVideo() {
    if (localVideo.srcObject != null) {
        localVideo.srcObject.getTracks().forEach(function (track) {
            track.stop();
        });
        localVideo.srcObject = null;
    }
}
function UpdateVideo(constraints, OnStream) {
    StopVideo();
    navigator.mediaDevices.getUserMedia(constraints).
        then(stream => {
            localVideo.srcObject = stream;
            if(typeof(OnStream)!="undefined")
                OnStream(stream);
        }).
        catch((msg) => console.log(msg, constraints));
}

function UpdateButton() {
    var selectedAudioDevice = audioDevices.length !== 0 ?
        { deviceId: { exact: audioDevices[0][0] } } :
        false;
    var selectedVideoDevice = videoDevices.length !== 0 ?
        { deviceId: { exact: videoDevices[0][0] } } :
        false;

    var audioDeviceId = GetSelectedRadio('audio_devices');
    if (audioDeviceId != null) {
        if (audioDeviceId == -1)
            selectedAudioDevice = false;
        else
            selectedAudioDevice = { deviceId: { exact: audioDevices[audioDeviceId][0] } };
    }
    var videoDeviceId = GetSelectedRadio('video_devices');
    if (videoDeviceId != null) {
        if (videoDeviceId == -1)
            selectedVideoDevice = false;
        else
            selectedVideoDevice = { deviceId: { exact: videoDevices[videoDeviceId][0] } };
    }
    var constraints = {
        audio: selectedAudioDevice,
        video: selectedVideoDevice
    };
    UpdateVideo(constraints, (x) => UpdateCall());
}